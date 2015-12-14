'use strict';

var viewMap = {
  overview_tab: "./view/overview.html",
  req_tab: "./view/requestDetail.html",
  res_tab: "./view/responseDetail.html"
}

app.controller('detailController', function ($scope, $rootScope) {
  $scope.tab = viewMap.req_tab;
  $("#centeredmenu ul li a").click(function(){
    $("#centeredmenu ul li a").removeClass("active");
    $(this).toggleClass("active");
    $scope.tab = viewMap[$(this).attr("id")];
    $scope.$apply();
  });
});

