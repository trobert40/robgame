const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy pour les requêtes API
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
    })
  );

  // Proxy pour les WebSockets (Socket.io)
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
      ws: true,
    })
  );
};
