// 导入依赖
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

// 导入路由
const indexRouter = require('./routes/index');
const sqliRouter = require('./routes/sqli');
const xssRouter = require('./routes/xss');
const csrfRouter = require('./routes/csrf');
const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
// 导入新增路由
const commandRouter = require('./routes/command');
const includeRouter = require('./routes/include');
const xmlRouter = require('./routes/xml');
const logicRouter = require('./routes/logic');
const middlewareRouter = require('./routes/middleware');

// 创建Express应用
const app = express();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 路由
app.use('/', indexRouter);
app.use('/sqli', sqliRouter);
app.use('/xss', xssRouter);
app.use('/csrf', csrfRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
// 使用新增路由
app.use('/command', commandRouter);
app.use('/include', includeRouter);
app.use('/xml', xmlRouter);
app.use('/logic', logicRouter);
app.use('/middleware', middlewareRouter);

// 错误处理
app.use((req, res, next) => {
  res.status(404).render('error', {
    message: '页面未找到',
    error: { status: 404 }
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', {
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app; 