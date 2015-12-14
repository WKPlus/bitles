var scope_requestList;

var bind = function(scope){
  scope_requestList = scope;
  var requestList = scope.requestList;
}

var appendRequestList = function(requestInfo){
  console.log(requestInfo);
  var now = new Date();
  var requestList = scope_requestList.requestList;
  var urlDetail = requestInfo.getUrlDetail();
  requestInfo.time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  requestInfo.path = urlDetail.pathname;
  requestInfo.host = urlDetail.hostname;
  requestInfo.req_header = JSON.stringify(requestInfo.req_header, null, 4);
  requestList.push(requestInfo);
  scope_requestList.$apply();
}

module.exports.bind = bind;
module.exports.appendRequestList = appendRequestList;

