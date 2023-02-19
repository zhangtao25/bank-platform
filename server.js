const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');
const express = require('express');
const app = express();


app.use(
    '/api',
    createProxyMiddleware({
        target:'http://101.35.6.121:10031',
        changeOrigin: true,
        pathRewrite: { '/api': '/' },
    }),
);

// 健康检查
app.get('/vi/health', (req, res) => {
    res.end(`365ms`);
});
app.use(history()); // 这里千万要注意，要在static静态资源上面
// 托管静态文件
app.use(express.static('dist'));

// 监听8080端口
app.listen(8080, function () {
    console.log('hi');
});
