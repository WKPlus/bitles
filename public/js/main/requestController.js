'use strict';

var main = require("./proxy/proxy.js");
var htmlDrawer = require("./proxy/htmlDrawer.js");

$('.slim-scroll').each(function () {
  var $this = $(this);
  var scrollHeight = $this.prop("scrollHeight");
  $this.slimScroll({
    height: 'inherit',
    railVisible:true,
    scrollTo: scrollHeight
  });
});


app.controller('requestController', function ($scope, $rootScope,$interval) {
  $scope.openWindows = function(id){
    $rootScope.request_detail = id;
    $(".request_cell").css("background-color", "");
    $(".request_cell").eq(this.$index).css("background-color", "#EBF4FF");
  }
    $scope.requestList = [];
    $("#slim").bind("DOMSubtreeModified", function(){
      $('.slim-scroll').each(function () {
        var $this = $(this);
        var scrollHeight = $this.prop("scrollHeight");
        $this.slimScroll({
          height: 'inherit',
          railVisible:true,
          scrollTo: scrollHeight
        });
      });
    });
    htmlDrawer.bind($scope);
});
