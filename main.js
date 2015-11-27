var Proxy = require('http-mitm-proxy');

var ignore_file_type = ['js', 'css', 'jpg', 'png', 'gif', 'jpeg'];

var proxy = Proxy();

proxy.onError(function(ctx, err) {
  console.log(ctx.clientToProxyRequest.headers.host);
  console.error('proxy error:', err);
});

var f = function(ctx, callback) {
  console.log(Array(21).join(">"));
  var u = ctx.clientToProxyRequest.headers.host + ctx.clientToProxyRequest.url;
  u = (ctx.isSSL ? 'https://' : 'http://') + u
  console.log(u);
  console.log(ctx.clientToProxyRequest.headers);

  console.log(Array(21).join("<"));
  console.log(ctx.serverToProxyResponse.headers);
  console.log("\n\n\n");
};

proxy.onRequest(function(ctx, callback) {
  // add onResponseEnd function when requesting a resource
  // except for ignore file types
  var ft = ctx.clientToProxyRequest.url.split(".").pop().split(/\#|\?/, 1)[0];
  if (ignore_file_type.indexOf(ft) < 0) {
    ctx.onResponseEnd(f);
  }
  //console.log("--------------request begin-------------");
  //console.log(ctx.clientToProxyRequest.headers.host);
  //console.log(ctx.clientToProxyRequest.url);
  //console.log("--------------request end---------------");
  return callback();
});

//proxy.onResponse(function(ctx, callback) {
//  console.log("--------------response begin-------------");
//  console.log(ctx.clientToProxyRequest.headers.host);
//  console.log(ctx.clientToProxyRequest.url);
//  console.log("--------------response end---------------");
//  return callback();
//});

proxy.listen({port: 5050});
