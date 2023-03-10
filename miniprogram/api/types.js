/** 请求方式 */
export var Method;
/** 是否必需 */

(function (Method) {
  Method["GET"] = "GET";
  Method["POST"] = "POST";
  Method["PUT"] = "PUT";
  Method["DELETE"] = "DELETE";
  Method["HEAD"] = "HEAD";
  Method["OPTIONS"] = "OPTIONS";
  Method["PATCH"] = "PATCH";
})(Method || (Method = {}));

export var Required;
/** 请求数据类型 */

(function (Required) {
  Required["false"] = "0";
  Required["true"] = "1";
})(Required || (Required = {}));

export var RequestBodyType;
/** 请求路径参数类型 */

(function (RequestBodyType) {
  RequestBodyType["query"] = "query";
  RequestBodyType["form"] = "form";
  RequestBodyType["json"] = "json";
  RequestBodyType["text"] = "text";
  RequestBodyType["file"] = "file";
  RequestBodyType["raw"] = "raw";
  RequestBodyType["none"] = "none";
})(RequestBodyType || (RequestBodyType = {}));

export var RequestParamType;
/** 请求查询参数类型 */

(function (RequestParamType) {
  RequestParamType["string"] = "string";
  RequestParamType["number"] = "number";
})(RequestParamType || (RequestParamType = {}));

export var RequestQueryType;
/** 请求表单条目类型 */

(function (RequestQueryType) {
  RequestQueryType["string"] = "string";
  RequestQueryType["number"] = "number";
})(RequestQueryType || (RequestQueryType = {}));

export var RequestFormItemType;
/** 返回数据类型 */

(function (RequestFormItemType) {
  RequestFormItemType["text"] = "text";
  RequestFormItemType["file"] = "file";
})(RequestFormItemType || (RequestFormItemType = {}));

export var ResponseBodyType;
/** 查询字符串数组格式化方式 */

(function (ResponseBodyType) {
  ResponseBodyType["json"] = "json";
  ResponseBodyType["text"] = "text";
  ResponseBodyType["xml"] = "xml";
  ResponseBodyType["raw"] = "raw";
})(ResponseBodyType || (ResponseBodyType = {}));

export var QueryStringArrayFormat;
/** 接口定义 */

(function (QueryStringArrayFormat) {
  QueryStringArrayFormat["brackets"] = "brackets";
  QueryStringArrayFormat["indices"] = "indices";
  QueryStringArrayFormat["repeat"] = "repeat";
  QueryStringArrayFormat["comma"] = "comma";
  QueryStringArrayFormat["json"] = "json";
})(QueryStringArrayFormat || (QueryStringArrayFormat = {}));