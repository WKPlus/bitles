var Proxy = require('http-mitm-proxy'),
    Iconv = require('iconv').Iconv,
    zlib = require('zlib'),
    charset = require('charset'),
    _ = require('underscore');
  
var htmlDrawer = require("./proxy/htmlDrawer.js");

var ignore_file_type = ['js', 'css', 'jpg', 'png', 'gif', 'jpeg'];
var PORT = 5050;

var proxy = Proxy();
var req_data_pool = new Map();
var res_data_pool = new Map();

_.mixin({
    curry: function(func) {
        var applied = Array.prototype.slice.call(arguments, 1);
        return function() {
            var args = applied.concat(Array.prototype.slice.call(arguments));
            return func.apply(this, args);
        };
    }
});

proxy.onError(function(ctx, err) {
  console.log(ctx.clientToProxyRequest.headers.host);
  console.error('proxy error:', err);
});

var get_url = function(ctx) {
  var u = ctx.clientToProxyRequest.headers.host + ctx.clientToProxyRequest.url;
  u = (ctx.isSSL ? 'https://' : 'http://') + u;
  return u;

};

var is_image_file = function(headers) {
  return headers['content-type'].indexOf('image') >= 0;
};

var is_zipped = function(headers) {
  if (headers['content-encoding']) {
    return headers['content-encoding'].indexOf('gzip') >= 0
  }else {
    return false;
  }
};

var decode_content = function(buffer, cs) {
  if (['UTF8', 'utf8', 'UTF-8', 'utf-8'].indexOf(cs)) {
    return buffer.toString(cs);
  }else {
    var to_utf8_iconv = new Iconv(cs, 'UTF-8//TRANSLIT//IGNORE');
    var utf8_buffer = to_utf8_iconv.convert(buffer);
    return utf8_buffer.toString();
  }
};

var concate_buffers = function(buffers) {
  var size = 0;
  for(var i = 0, l = buffers.length; i < l; i++) {
    size += buffers[i].length;
  }

  var buffer = new Buffer(size), pos = 0;
  for(var i = 0, l = buffers.length; i < l; i++) {
    buffers[i].copy(buffer, pos);
    pos += buffers[i].length;
  }
  return buffer;
};

var log_handler = function(ctx) {
  url = get_url(ctx);
  console.log(url);
  console.log(JSON.stringify(ctx.clientToProxyRequest.headers, null, '  '));
  //初始化一个requestInfo对象，传给htmlDrawer
  var requestInfo = {
    url: url,
    req_header: ctx.clientToProxyRequest.headers,
    req_body: "",
    res_header: "",
    res_body: "",
    err_msg: ""
  };

  var buffers = req_data_pool.get(url);
  req_data_pool.delete(url);
  if (buffers) {
    var req_body = concate_buffers(buffers).toString('UTF8');
    console.log(req_body)
    requestInfo.req_body = req_body;
  }

  console.log(Array(81).join("-"));
  console.log(JSON.stringify(ctx.serverToProxyResponse.headers, null, '  '));
  requestInfo.res_header = ctx.serverToProxyResponse.headers; 

  // if response body is empty or response is image file, skip logging content
  var buffers = res_data_pool.get(url);
  res_data_pool.delete(url);
  if (is_image_file(ctx.serverToProxyResponse.headers)) {
    return;
  }

  if (buffers) {
    var cs = charset(ctx.serverToProxyResponse.headers['content-type']);
    var buffer = concate_buffers(buffers);
    if (is_zipped(ctx.serverToProxyResponse.headers)) {
      zlib.unzip(buffer, function(err, buffer) {
        if (!err) {
          console.log(decode_content(buffer, cs));
          requestInfo.res_body = decode_content(buffer, cs);
        }else {
          console.error("unzip error:", err);
          requestInfo.err_msg = err;
        }
      });
    }else {
      console.log(decode_content(buffer, cs));
      requestInfo.res_body = decode_content(buffer, cs);
    }
  }
  console.log("push url into requestList");
  htmlDrawer.appendRequestList(requestInfo);
};

var log_wrapper = function(ctx, callback) {
  console.log(Array(81).join(">"));
  log_handler(ctx);
  console.log(Array(81).join("<"));
  return callback();
};

var chunk_handler = function(data_pool, ctx, chunk, callback) {
  url = get_url(ctx);
  if (!data_pool.has(url)) {
    data_pool.set(url, []);
  }
  data_pool.get(url).push(chunk);
  return callback(null, chunk);
};

var file_type = function(url) {
  return url.split(/\#|\?/, 1)[0].split(".").pop();
};

proxy.onRequest(function(ctx, callback) {
  // add onResponseEnd function when requesting a resource
  // except for ignore file types
  var ft = file_type(ctx.clientToProxyRequest.url);
  if (ignore_file_type.indexOf(ft) < 0) {
    ctx.onRequestData(_.curry(chunk_handler, req_data_pool));
    ctx.onResponseData(_.curry(chunk_handler, res_data_pool));
    ctx.onResponseEnd(log_wrapper);
  }
  return callback();
});


proxy.listen({port: PORT});
