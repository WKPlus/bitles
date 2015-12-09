'use strict';

app.controller('detailController', function ($scope, $rootScope) {
  $scope.isRequest = true;
  $("#centeredmenu ul li a").click(function(){
    $("#centeredmenu ul li a").removeClass("active");
    $(this).toggleClass("active");
    $scope.isRequest = $(this).attr("id") == "req_tab" ? true : false;
    $scope.$apply();
  });
});

