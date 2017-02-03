var httpProxy = require("http-proxy");
var http = require("http");
var fs = require("fs");
var morgan = require("morgan");
var logger = morgan("short");

var fileName = "D:/home/LogFiles/Application/headers-" + Date.now() + ".log";
var headers = { acrh: {}, acrm: {} };

var proxy = httpProxy
  .createProxyServer({ target: "https://accountview.net", secure: false })
  .on("proxyReq", function(proxyReq, req, res, options) {
    if (req.method === "OPTIONS") {
      proxyReq.setHeader(
        "Access-Control-Request-Headers",
        "authorization, x-company"
      );
    }
  })
  .on("proxyRes", function(proxyRes, req, res) {
    proxyRes.headers["access-control-allow-headers"] = "origin, authorization, x-company";
    proxyRes.headers["access-control-max-age"] = 3600;
  });

var listener = http.createServer(function(req, res) {
  var origin = req.headers["origin"];
  var acrh = req.headers["access-control-request-headers"];
  var acrm = req.headers["access-control-request-method"];
  var ua = req.headers["user-agent"];
  if (acrh) {
    headers.acrh[acrh] = "";
    headers.acrm[acrm] = "";

    headers[ua] = headers[ua] || {};
    headers[ua]["origin"] = origin || "";
    headers[ua]["access-control-request-headers"] = acrh || "";
    headers[ua]["access-control-request-method"] = acrm || "";

    fs.writeFile(fileName, JSON.stringify(headers, 0, 2), function(err) {
      if (err) {
        throw err;
      }
    });
  }

  logger(req, res, function(err) {
    if (err) {
      throw err;
    }
    proxy.web(req, res);
  });
}).listen(process.env.PORT || 3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
