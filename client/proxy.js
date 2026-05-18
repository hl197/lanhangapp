// 统一代理服务器（无需额外依赖）
const http = require("http");

const BACKEND = { host: "localhost", port: 8080 };
const EXPO = { host: "localhost", port: 8081 };
const PORT = 8082;

const server = http.createServer((req, res) => {
  const target = req.url.startsWith("/api") ? BACKEND : EXPO;

  const options = {
    hostname: target.host,
    port: target.port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${target.host}:${target.port}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error(`Proxy error [${req.url}]:`, err.message);
    res.writeHead(502);
    res.end(`Proxy error: ${err.message}`);
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`\n  Proxy ready: http://localhost:${PORT}`);
  console.log(`    /api/*  -> http://${BACKEND.host}:${BACKEND.port}/api/*`);
  console.log(`    /*      -> http://${EXPO.host}:${EXPO.port}/*\n`);
});
