var httpProxy = require('http-proxy');
var http = require('http');
var morgan = require('morgan');
var logger = morgan('short');
var proxy = httpProxy.createProxyServer({
    target: 'https://accountview.net',
    secure: false
  })
  .on('proxyRes', function (proxyRes, req, res) {
    proxyRes.headers['access-control-allow-origin'] = '*';
    proxyRes.headers['access-control-max-age'] = 3600;
  });

var listener = http.createServer(
  function (req, res) {
    logger(req, res, function (err) {
      // if (err) return done(err)
      proxy.web(req, res);
    })
  }
).listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
