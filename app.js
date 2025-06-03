// 导入依赖
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const db = require('./config/db'); // 导入数据库模块

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

// 导入路由
const indexRouter = require('./routes/index');
const sqliRouter = require('./routes/sqli');
const xssRouter = require('./routes/xss');
const csrfRouter = require('./routes/csrf');
const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
const commandRouter = require('./routes/command');
const includeRouter = require('./routes/include');
const xmlRouter = require('./routes/xml');
const logicRouter = require('./routes/logic');
const middlewareRouter = require('./routes/middleware');
const sourceRouter = require('./routes/source');
const apiRouter = require('./routes/api');

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
app.use('/command', commandRouter);
app.use('/include', includeRouter);
app.use('/xml', xmlRouter);
app.use('/logic', logicRouter);
app.use('/middleware', middlewareRouter);
app.use('/source', sourceRouter);
app.use('/api', apiRouter);

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

// 先初始化数据库，再启动服务器
db.initDb().then(success => {
  // 无论数据库初始化是否成功，都启动服务器
  app.listen(PORT, () => {
    if (success) {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    } else {
      console.log(`服务器运行在 http://localhost:${PORT}，但数据库连接失败，SQL注入相关功能将不可用`);
    }
  });
}).catch(err => {
  console.error('数据库初始化错误:', err);
  // 即使有错误也启动服务器
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}，但数据库连接失败，SQL注入相关功能将不可用`);
  });
});

module.exports = app; 