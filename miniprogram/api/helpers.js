import _extends from "extends";
import { QueryStringArrayFormat } from './types';

/**
 * 定义配置。
 *
 * @param config 配置
 */
export function defineConfig(config, hooks) {
  if (hooks) {
    Object.defineProperty(config, 'hooks', {
      value: hooks,
      configurable: false,
      enumerable: false,
      writable: false
    });
  }

  return config;
}
export var FileData = /*#__PURE__*/function () {
  /**
   * 原始文件数据。
   */

  /**
   * 选项。
   */

  /**
   * 文件数据辅助类，统一网页、小程序等平台的文件上传。
   *
   * @param originalFileData 原始文件数据
   * @param options 若使用内部的 getFormData，则选项会被其使用
   */
  function FileData(originalFileData, options) {
    this.originalFileData = void 0;
    this.options = void 0;
    this.originalFileData = originalFileData;
    this.options = options;
  }
  /**
   * 获取原始文件数据。
   *
   * @returns 原始文件数据
   */


  var _proto = FileData.prototype;

  _proto.getOriginalFileData = function getOriginalFileData() {
    return this.originalFileData;
  }
  /**
   * 获取选项。
   */
  ;

  _proto.getOptions = function getOptions() {
    return this.options;
  };

  return FileData;
}();
/**
 * 解析请求数据，从请求数据中分离出普通数据和文件数据。
 *
 * @param requestData 要解析的请求数据
 * @returns 包含普通数据(data)和文件数据(fileData)的对象，data、fileData 为空对象时，表示没有此类数据
 */

export function parseRequestData(requestData) {
  var result = {
    data: {},
    fileData: {}
  };
  /* istanbul ignore else */

  if (requestData != null) {
    if (typeof requestData === 'object' && !Array.isArray(requestData)) {
      Object.keys(requestData).forEach(function (key) {
        if (requestData[key] && requestData[key] instanceof FileData) {
          result.fileData[key] = requestData[key].getOriginalFileData();
        } else {
          result.data[key] = requestData[key];
        }
      });
    } else {
      result.data = requestData;
    }
  }

  return result;
}

var queryStringify = function queryStringify(key, value, arrayFormat) {
  var str = '';

  if (value != null) {
    if (!Array.isArray(value)) {
      str = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    } else if (arrayFormat === QueryStringArrayFormat.indices) {
      str = value.map(function (v, i) {
        return encodeURIComponent(key + "[" + i + "]") + "=" + encodeURIComponent(v);
      }).join('&');
    } else if (arrayFormat === QueryStringArrayFormat.repeat) {
      str = value.map(function (v) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(v);
      }).join('&');
    } else if (arrayFormat === QueryStringArrayFormat.comma) {
      str = encodeURIComponent(key) + "=" + encodeURIComponent(value.join(','));
    } else if (arrayFormat === QueryStringArrayFormat.json) {
      str = encodeURIComponent(key) + "=" + encodeURIComponent(JSON.stringify(value));
    } else {
      str = value.map(function (v) {
        return encodeURIComponent(key + "[]") + "=" + encodeURIComponent(v);
      }).join('&');
    }
  }

  return str;
};
/**
 * 准备要传给请求函数的参数。
 */


export function prepare(requestConfig, requestData) {
  var requestPath = requestConfig.path;

  var _parseRequestData = parseRequestData(requestData),
      data = _parseRequestData.data,
      fileData = _parseRequestData.fileData;

  var dataIsObject = data != null && typeof data === 'object' && !Array.isArray(data);

  if (dataIsObject) {
    // 替换路径参数
    if (Array.isArray(requestConfig.paramNames) && requestConfig.paramNames.length > 0) {
      Object.keys(data).forEach(function (key) {
        if (requestConfig.paramNames.indexOf(key) >= 0) {
          // ref: https://github.com/YMFE/yapi/blob/master/client/containers/Project/Interface/InterfaceList/InterfaceEditForm.js#L465
          requestPath = requestPath.replace(new RegExp("\\{" + key + "\\}", 'g'), data[key]).replace(new RegExp("/:" + key + "(?=/|$)", 'g'), "/" + data[key]);
          delete data[key];
        }
      });
    } // 追加查询参数到路径上


    var queryString = '';

    if (Array.isArray(requestConfig.queryNames) && requestConfig.queryNames.length > 0) {
      Object.keys(data).forEach(function (key) {
        if (requestConfig.queryNames.indexOf(key) >= 0) {
          if (data[key] != null) {
            queryString += "" + (queryString ? '&' : '') + queryStringify(key, data[key], requestConfig.queryStringArrayFormat);
          }

          delete data[key];
        }
      });
    }

    if (queryString) {
      requestPath += "" + (requestPath.indexOf('?') > -1 ? '&' : '?') + queryString;
    }
  } // 全部数据


  var allData = _extends({}, dataIsObject ? data : {}, fileData); // 获取表单数据


  var getFormData = function getFormData() {
    var useNativeFormData = typeof FormData !== 'undefined';
    var useNodeFormData = !useNativeFormData && // https://github.com/fjc0k/vtils/blob/master/src/utils/inNodeJS.ts
    typeof global === 'object' && typeof global['process'] === 'object' && typeof global['process']['versions'] === 'object' && global['process']['versions']['node'] != null;
    var UniFormData = useNativeFormData ? FormData : useNodeFormData ? eval("require('form-data')") : undefined;

    if (!UniFormData) {
      throw new Error('当前环境不支持 FormData');
    }

    var formData = new UniFormData();
    Object.keys(data).forEach(function (key) {
      formData.append(key, data[key]);
    });
    Object.keys(fileData).forEach(function (key) {
      var options = requestData[key].getOptions();
      formData.append(key, fileData[key], useNativeFormData ? options == null ? void 0 : options.filename : options);
    });
    return formData;
  };

  return _extends({}, requestConfig, {
    path: requestPath,
    rawData: requestData,
    data: data,
    hasFileData: fileData && Object.keys(fileData).length > 0,
    fileData: fileData,
    allData: allData,
    getFormData: getFormData
  });
}