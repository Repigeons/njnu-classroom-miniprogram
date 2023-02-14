import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _createForOfIteratorHelperLoose from "@babel/runtime/helpers/esm/createForOfIteratorHelperLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import JSON5 from 'json5';
import nodeFetch from 'node-fetch';
import path from 'path';
import prettier from 'prettier';
import ProxyAgent from 'proxy-agent';
import toJsonSchema from 'to-json-schema';
import { castArray, cloneDeepFast, forOwn, isArray, isEmpty, isObject, mapKeys, memoize, run, traverse } from 'vtils';
import { compile } from 'json-schema-to-typescript';
import { FileData } from './helpers';
import { Method, RequestBodyType, RequestFormItemType, Required, ResponseBodyType } from './types';
import { URL } from 'url';
/**
 * 抛出错误。
 *
 * @param msg 错误信息
 */

export function throwError() {
  for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
    msg[_key] = arguments[_key];
  }

  /* istanbul ignore next */
  throw new Error(msg.join(''));
}
/**
 * 将路径统一为 unix 风格的路径。
 *
 * @param path 路径
 * @returns unix 风格的路径
 */

export function toUnixPath(path) {
  return path.replace(/[/\\]+/g, '/');
}
/**
 * 获得规范化的相对路径。
 *
 * @param from 来源路径
 * @param to 去向路径
 * @returns 相对路径
 */

export function getNormalizedRelativePath(from, to) {
  return toUnixPath(path.relative(path.dirname(from), to)).replace(/^(?=[^.])/, './').replace(/\.(ts|js)x?$/i, '');
}
/**
 * 原地遍历 JSONSchema。
 */

export function traverseJsonSchema(jsonSchema, cb, currentPath) {
  if (currentPath === void 0) {
    currentPath = [];
  }

  /* istanbul ignore if */
  if (!isObject(jsonSchema)) return jsonSchema; // Mock.toJSONSchema 产生的 properties 为数组，然而 JSONSchema4 的 properties 为对象

  if (isArray(jsonSchema.properties)) {
    jsonSchema.properties = jsonSchema.properties.reduce(function (props, js) {
      props[js.name] = js;
      return props;
    }, {});
  } // 处理传入的 JSONSchema


  cb(jsonSchema, currentPath); // 继续处理对象的子元素

  if (jsonSchema.properties) {
    forOwn(jsonSchema.properties, function (item, key) {
      return traverseJsonSchema(item, cb, [].concat(currentPath, [key]));
    });
  } // 继续处理数组的子元素


  if (jsonSchema.items) {
    castArray(jsonSchema.items).forEach(function (item, index) {
      return traverseJsonSchema(item, cb, [].concat(currentPath, [index]));
    });
  } // 处理 oneOf


  if (jsonSchema.oneOf) {
    jsonSchema.oneOf.forEach(function (item) {
      return traverseJsonSchema(item, cb, currentPath);
    });
  } // 处理 anyOf


  if (jsonSchema.anyOf) {
    jsonSchema.anyOf.forEach(function (item) {
      return traverseJsonSchema(item, cb, currentPath);
    });
  } // 处理 allOf


  if (jsonSchema.allOf) {
    jsonSchema.allOf.forEach(function (item) {
      return traverseJsonSchema(item, cb, currentPath);
    });
  }

  return jsonSchema;
}
/**
 * 原地处理 JSONSchema。
 *
 * @param jsonSchema 待处理的 JSONSchema
 * @returns 处理后的 JSONSchema
 */

export function processJsonSchema(jsonSchema, customTypeMapping) {
  return traverseJsonSchema(jsonSchema, function (jsonSchema) {
    // 删除通过 swagger 导入时未剔除的 ref
    delete jsonSchema.$ref;
    delete jsonSchema.$$ref; // 数组只取第一个判断类型

    if (jsonSchema.type === 'array' && Array.isArray(jsonSchema.items) && jsonSchema.items.length) {
      jsonSchema.items = jsonSchema.items[0];
    } // 处理类型名称为标准的 JSONSchema 类型名称


    if (jsonSchema.type) {
      // 类型映射表，键都为小写
      var typeMapping = _extends({
        byte: 'integer',
        short: 'integer',
        int: 'integer',
        long: 'integer',
        float: 'number',
        double: 'number',
        bigdecimal: 'number',
        char: 'string',
        void: 'null'
      }, mapKeys(customTypeMapping, function (_, key) {
        return key.toLowerCase();
      }));

      var isMultiple = Array.isArray(jsonSchema.type);
      var types = castArray(jsonSchema.type).map(function (type) {
        // 所有类型转成小写，如：String -> string
        type = type.toLowerCase(); // 映射为标准的 JSONSchema 类型

        type = typeMapping[type] || type;
        return type;
      });
      jsonSchema.type = isMultiple ? types : types[0];
    } // 移除字段名称首尾空格


    if (jsonSchema.properties) {
      forOwn(jsonSchema.properties, function (_, prop) {
        var propDef = jsonSchema.properties[prop];
        delete jsonSchema.properties[prop];
        jsonSchema.properties[prop.trim()] = propDef;
      });

      if (Array.isArray(jsonSchema.required)) {
        jsonSchema.required = jsonSchema.required.map(function (prop) {
          return prop.trim();
        });
      }
    }

    return jsonSchema;
  });
}
/**
 * 获取适用于 JSTT 的 JSONSchema。
 *
 * @param jsonSchema 待处理的 JSONSchema
 * @returns 适用于 JSTT 的 JSONSchema
 */

export function jsonSchemaToJSTTJsonSchema(jsonSchema, typeName) {
  if (jsonSchema) {
    // 去除最外层的 description 以防止 JSTT 提取它作为类型的注释
    delete jsonSchema.description;
  }

  return traverseJsonSchema(jsonSchema, function (jsonSchema, currentPath) {
    // 支持类型引用
    var refValue = // YApi 低版本不支持配置 title，可以在 description 里配置
    jsonSchema.title == null ? jsonSchema.description : jsonSchema.title;

    if (refValue != null && refValue.startsWith('&')) {
      var typeRelativePath = refValue.substring(1);
      var typeAbsolutePath = toUnixPath(path.resolve(path.dirname(("/" + currentPath.join('/')).replace(/\/{2,}/g, '/')), typeRelativePath).replace(/^[a-z]+:/i, ''));
      var typeAbsolutePathArr = typeAbsolutePath.split('/').filter(Boolean);
      var tsTypeLeft = '';
      var tsTypeRight = typeName;

      for (var _iterator = _createForOfIteratorHelperLoose(typeAbsolutePathArr), _step; !(_step = _iterator()).done;) {
        var key = _step.value;
        tsTypeLeft += 'NonNullable<';
        tsTypeRight += "[" + JSON.stringify(key) + "]>";
      }

      var tsType = "" + tsTypeLeft + tsTypeRight;
      jsonSchema.tsType = tsType;
    } // 去除 title 和 id，防止 json-schema-to-typescript 提取它们作为接口名


    delete jsonSchema.title;
    delete jsonSchema.id; // 忽略数组长度限制

    delete jsonSchema.minItems;
    delete jsonSchema.maxItems;

    if (jsonSchema.type === 'object') {
      // 将 additionalProperties 设为 false
      jsonSchema.additionalProperties = false;
    } // 删除 default，防止 json-schema-to-typescript 根据它推测类型


    delete jsonSchema.default;
    return jsonSchema;
  });
}
/**
 * 将 JSONSchema 字符串转为 JSONSchema 对象。
 *
 * @param str 要转换的 JSONSchema 字符串
 * @returns 转换后的 JSONSchema 对象
 */

export function jsonSchemaStringToJsonSchema(str, customTypeMapping) {
  return processJsonSchema(JSON.parse(str), customTypeMapping);
}
/**
 * 获得 JSON 数据的 JSONSchema 对象。
 *
 * @param json JSON 数据
 * @returns JSONSchema 对象
 */

export function jsonToJsonSchema(json, customTypeMapping) {
  var schema = toJsonSchema(json, {
    required: false,
    arrays: {
      mode: 'first'
    },
    objects: {
      additionalProperties: false
    },
    strings: {
      detectFormat: false
    },
    postProcessFnc: function postProcessFnc(type, schema, value) {
      if (!schema.description && !!value && type !== 'object') {
        schema.description = JSON.stringify(value);
      }

      return schema;
    }
  });
  delete schema.description;
  return processJsonSchema(schema, customTypeMapping);
}
/**
 * 获得 mockjs 模板的 JSONSchema 对象。
 *
 * @param template mockjs 模板
 * @returns JSONSchema 对象
 */

export function mockjsTemplateToJsonSchema(template, customTypeMapping) {
  var actions = []; // https://github.com/nuysoft/Mock/blob/refactoring/src/mock/constant.js#L27

  var keyRe = /(.+)\|(?:\+(\d+)|([+-]?\d+-?[+-]?\d*)?(?:\.(\d+-?\d*))?)/; // https://github.com/nuysoft/Mock/wiki/Mock.Random

  var numberPatterns = ['natural', 'integer', 'float', 'range', 'increment'];
  var boolPatterns = ['boolean', 'bool'];

  var normalizeValue = function normalizeValue(value) {
    if (typeof value === 'string' && value.startsWith('@')) {
      var pattern = value.slice(1);

      if (numberPatterns.some(function (p) {
        return pattern.startsWith(p);
      })) {
        return 1;
      }

      if (boolPatterns.some(function (p) {
        return pattern.startsWith(p);
      })) {
        return true;
      }
    }

    return value;
  };

  traverse(template, function (value, key, parent) {
    if (typeof key === 'string') {
      actions.push(function () {
        delete parent[key];
        parent[// https://github.com/nuysoft/Mock/blob/refactoring/src/mock/schema/schema.js#L16
        key.replace(keyRe, '$1')] = normalizeValue(value);
      });
    }
  });
  actions.forEach(function (action) {
    return action();
  });
  return jsonToJsonSchema(template, customTypeMapping);
}
/**
 * 获得属性定义列表的 JSONSchema 对象。
 *
 * @param propDefinitions 属性定义列表
 * @returns JSONSchema 对象
 */

export function propDefinitionsToJsonSchema(propDefinitions, customTypeMapping) {
  return processJsonSchema({
    type: 'object',
    required: propDefinitions.reduce(function (res, prop) {
      if (prop.required) {
        res.push(prop.name);
      }

      return res;
    }, []),
    properties: propDefinitions.reduce(function (res, prop) {
      res[prop.name] = _extends({
        type: prop.type,
        description: prop.comment
      }, prop.type === 'file' ? {
        tsType: FileData.name
      } : {});
      return res;
    }, {})
  }, customTypeMapping);
}
var JSTTOptions = {
  bannerComment: '',
  style: {
    bracketSpacing: false,
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false
  }
};
/**
 * 根据 JSONSchema 对象生产 TypeScript 类型定义。
 *
 * @param jsonSchema JSONSchema 对象
 * @param typeName 类型名称
 * @returns TypeScript 类型定义
 */

export function jsonSchemaToType(_x, _x2) {
  return _jsonSchemaToType.apply(this, arguments);
}

function _jsonSchemaToType() {
  _jsonSchemaToType = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(jsonSchema, typeName) {
    var fakeTypeName, code;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!isEmpty(jsonSchema)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", "export interface " + typeName + " {}");

          case 2:
            if (!jsonSchema.__is_any__) {
              _context.next = 5;
              break;
            }

            delete jsonSchema.__is_any__;
            return _context.abrupt("return", "export type " + typeName + " = any");

          case 5:
            // JSTT 会转换 typeName，因此传入一个全大写的假 typeName，生成代码后再替换回真正的 typeName
            fakeTypeName = 'THISISAFAKETYPENAME';
            _context.next = 8;
            return compile(jsonSchemaToJSTTJsonSchema(cloneDeepFast(jsonSchema), typeName), fakeTypeName, JSTTOptions);

          case 8:
            code = _context.sent;
            return _context.abrupt("return", code.replace(fakeTypeName, typeName).trim());

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _jsonSchemaToType.apply(this, arguments);
}

export function getRequestDataJsonSchema(interfaceInfo, customTypeMapping) {
  var jsonSchema; // 处理表单数据（仅 POST 类接口）

  if (isPostLikeMethod(interfaceInfo.method)) {
    switch (interfaceInfo.req_body_type) {
      case RequestBodyType.form:
        jsonSchema = propDefinitionsToJsonSchema(interfaceInfo.req_body_form.map(function (item) {
          return {
            name: item.name,
            required: item.required === Required.true,
            type: item.type === RequestFormItemType.file ? 'file' : 'string',
            comment: item.desc
          };
        }), customTypeMapping);
        break;

      case RequestBodyType.json:
        if (interfaceInfo.req_body_other) {
          jsonSchema = interfaceInfo.req_body_is_json_schema ? jsonSchemaStringToJsonSchema(interfaceInfo.req_body_other, customTypeMapping) : jsonToJsonSchema(JSON5.parse(interfaceInfo.req_body_other), customTypeMapping);
        }

        break;

      default:
        /* istanbul ignore next */
        break;
    }
  } // 处理查询数据


  if (isArray(interfaceInfo.req_query) && interfaceInfo.req_query.length) {
    var queryJsonSchema = propDefinitionsToJsonSchema(interfaceInfo.req_query.map(function (item) {
      return {
        name: item.name,
        required: item.required === Required.true,
        type: item.type || 'string',
        comment: item.desc
      };
    }), customTypeMapping);
    /* istanbul ignore else */

    if (jsonSchema) {
      jsonSchema.properties = _extends({}, jsonSchema.properties, queryJsonSchema.properties);
      jsonSchema.required = [].concat(Array.isArray(jsonSchema.required) ? jsonSchema.required : [], Array.isArray(queryJsonSchema.required) ? queryJsonSchema.required : []);
    } else {
      jsonSchema = queryJsonSchema;
    }
  } // 处理路径参数


  if (isArray(interfaceInfo.req_params) && interfaceInfo.req_params.length) {
    var paramsJsonSchema = propDefinitionsToJsonSchema(interfaceInfo.req_params.map(function (item) {
      return {
        name: item.name,
        required: true,
        type: item.type || 'string',
        comment: item.desc
      };
    }), customTypeMapping);
    /* istanbul ignore else */

    if (jsonSchema) {
      jsonSchema.properties = _extends({}, jsonSchema.properties, paramsJsonSchema.properties);
      jsonSchema.required = [].concat(Array.isArray(jsonSchema.required) ? jsonSchema.required : [], Array.isArray(paramsJsonSchema.required) ? paramsJsonSchema.required : []);
    } else {
      jsonSchema = paramsJsonSchema;
    }
  }

  return jsonSchema || {};
}
export function getResponseDataJsonSchema(interfaceInfo, customTypeMapping, dataKey) {
  var jsonSchema = {};

  switch (interfaceInfo.res_body_type) {
    case ResponseBodyType.json:
      if (interfaceInfo.res_body) {
        jsonSchema = interfaceInfo.res_body_is_json_schema ? jsonSchemaStringToJsonSchema(interfaceInfo.res_body, customTypeMapping) : mockjsTemplateToJsonSchema(JSON5.parse(interfaceInfo.res_body), customTypeMapping);
      }

      break;

    default:
      jsonSchema = {
        __is_any__: true
      };
      break;
  }

  if (dataKey && jsonSchema) {
    jsonSchema = reachJsonSchema(jsonSchema, dataKey);
  }

  return jsonSchema;
}
export function reachJsonSchema(jsonSchema, path) {
  var last = jsonSchema;

  for (var _iterator2 = _createForOfIteratorHelperLoose(castArray(path)), _step2; !(_step2 = _iterator2()).done;) {
    var _last$properties;

    var segment = _step2.value;

    var _last = (_last$properties = last.properties) == null ? void 0 : _last$properties[segment];

    if (!_last) {
      return jsonSchema;
    }

    last = _last;
  }

  return last;
}
export function sortByWeights(list) {
  list.sort(function (a, b) {
    var _x$weights;

    var x = a.weights.length > b.weights.length ? b : a;
    var minLen = Math.min(a.weights.length, b.weights.length);
    var maxLen = Math.max(a.weights.length, b.weights.length);

    (_x$weights = x.weights).push.apply(_x$weights, new Array(maxLen - minLen).fill(0));

    var w = a.weights.reduce(function (w, _, i) {
      if (w === 0) {
        w = a.weights[i] - b.weights[i];
      }

      return w;
    }, 0);
    return w;
  });
  return list;
}
export function isGetLikeMethod(method) {
  return method === Method.GET || method === Method.OPTIONS || method === Method.HEAD;
}
export function isPostLikeMethod(method) {
  return !isGetLikeMethod(method);
}
export function getPrettierOptions() {
  return _getPrettierOptions.apply(this, arguments);
}

function _getPrettierOptions() {
  _getPrettierOptions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var prettierOptions, _yield$run, prettierConfigPathErr, prettierConfigPath, _yield$run2, prettierConfigErr, prettierConfig;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            prettierOptions = {
              parser: 'typescript',
              printWidth: 120,
              tabWidth: 2,
              singleQuote: true,
              semi: false,
              trailingComma: 'all',
              bracketSpacing: false,
              endOfLine: 'lf'
            }; // 测试时跳过本地配置的解析

            if (!process.env.JEST_WORKER_ID) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", prettierOptions);

          case 3:
            _context2.next = 5;
            return run(function () {
              return prettier.resolveConfigFile();
            });

          case 5:
            _yield$run = _context2.sent;
            prettierConfigPathErr = _yield$run[0];
            prettierConfigPath = _yield$run[1];

            if (!(prettierConfigPathErr || !prettierConfigPath)) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", prettierOptions);

          case 10:
            _context2.next = 12;
            return run(function () {
              return prettier.resolveConfig(prettierConfigPath);
            });

          case 12:
            _yield$run2 = _context2.sent;
            prettierConfigErr = _yield$run2[0];
            prettierConfig = _yield$run2[1];

            if (!(prettierConfigErr || !prettierConfig)) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return", prettierOptions);

          case 17:
            return _context2.abrupt("return", _extends({}, prettierOptions, prettierConfig, {
              parser: 'typescript'
            }));

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getPrettierOptions.apply(this, arguments);
}

export var getCachedPrettierOptions = memoize(getPrettierOptions);
export function httpGet(_x3, _x4) {
  return _httpGet.apply(this, arguments);
}

function _httpGet() {
  _httpGet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(url, query) {
    var _url, res;

    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _url = new URL(url);

            if (query) {
              Object.keys(query).forEach(function (key) {
                _url.searchParams.set(key, query[key]);
              });
            }

            url = _url.toString();
            _context3.next = 5;
            return nodeFetch(url, {
              method: 'GET',
              agent: new ProxyAgent()
            });

          case 5:
            res = _context3.sent;
            return _context3.abrupt("return", res.json());

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _httpGet.apply(this, arguments);
}