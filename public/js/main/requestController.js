'use strict';

var main = require("./main.js");
var htmlDrawer = require("./proxy/htmlDrawer.js");

$('.slim-scroll').each(function () {
  var $this = $(this);
  $this.slimScroll({
    height: 'inherit',
    railVisible:true
  });
});


app.controller('requestController', function ($scope, $rootScope,$interval) {
  $scope.openWindows = function(id){
    $rootScope.request_detail = id;
  }
    $scope.requestList = [];
    htmlDrawer.bind($scope);
});
