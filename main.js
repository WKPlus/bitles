var Proxy = require('http-mitm-proxy'),
    Iconv = require('iconv').Iconv,
    zlib = require('zlib'),
    charset = require('charset');
  

var ignore_file_type = ['js', 'css', 'jpg', 'png', 'gif', 'jpeg'];

var proxy = Proxy();
var data_pool = new Map();

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

var f = function(ctx, callback) {
  console.log(Array(41).join(">"));
  url = get_url(ctx);
  console.log(url);
  console.log(JSON.stringify(ctx.clientToProxyRequest.headers, null, '  '));

  console.log(Array(41).join("<"));
  console.log(JSON.stringify(ctx.serverToProxyResponse.headers, null, '  '));

  // if response body is empty or response is image file, skip logging content
  var buffers = data_pool.get(url);
  if (!buffers) {
    return callback();
  }
  if (is_image_file(ctx.serverToProxyResponse.headers)) {
    return callback();
  }

  var size = 0;
  for(var i = 0, l = buffers.length; i < l; i++) {
    size += buffers[i].length;
  }

  var buffer = new Buffer(size), pos = 0;
  for(var i = 0, l = buffers.length; i < l; i++) {
    buffers[i].copy(buffer, pos);
    pos += buffers[i].length;
  }

  var cs = charset(ctx.serverToProxyResponse.headers['content-type']);
  if (is_zipped(ctx.serverToProxyResponse.headers)) {
    zlib.unzip(buffer, function(err, buffer) {
      if (!err) {
        console.log(decode_content(buffer, cs));
      }else {
        console.log(err);
      }
    });
  }else {
    console.log(decode_content(buffer, cs));
  }
  return callback();
};

var chunk_handler = function(ctx, chunk, callback) {
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
    ctx.onResponseEnd(f);
    ctx.onResponseData(chunk_handler);
  }
  return callback();
});


proxy.listen({port: 5050});
