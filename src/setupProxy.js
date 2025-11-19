const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/naver',
    createProxyMiddleware({
      target: 'https://openapi.naver.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/naver': '', // /api/naver를 제거하고 실제 경로로 전달
      },
    })
  );
};

