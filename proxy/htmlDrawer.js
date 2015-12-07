var scope_requestList;

var bind = function(scope){
  scope_requestList = scope;
  var requestList = scope.requestList;
}

var appendRequestList = function(requestInfo){
  var requestList = scope_requestList.requestList;
  requestInfo.name = requestInfo.url || "";
  requestInfo.time = new Date().toTimeString();
  requestList.push(requestInfo);
  scope_requestList.$apply();
}

module.exports.bind = bind;
module.exports.appendRequestList = appendRequestList;

