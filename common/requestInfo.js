var URL = require("url");

function requestInfo(object){
  object = object || {}
  this.url = object.url || "";
  this.req_header = object.req_header || {};
  this.req_body = object.req_body || "";
  this.res_body = object.res_body || "";
  this.err_msg;
}

requestInfo.prototype.getUrlDetail = function(){
  if(!this.url) return {};
  return URL.parse(this.url);
}

module.exports = requestInfo;
