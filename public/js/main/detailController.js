'use strict';

app.controller('detailController', function ($scope, $rootScope) {
  $("#centeredmenu ul li a").click(function(){
    $("#centeredmenu ul li a").removeClass("active");
    $(this).toggleClass("active");
  });
});

