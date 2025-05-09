const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 首页路由
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Web安全靶场',
    activeMenu: 'home'
  });
});

// 源码查看路由
router.get('/source/:type/:level', (req, res) => {
  const { type, level } = req.params;
  
  // 安全检查：防止目录遍历
  const validTypes = ['sqli', 'xss', 'csrf', 'upload', 'download', 'command', 'include', 'xml', 'logic', 'middleware'];
  if (!validTypes.includes(type)) {
    return res.status(400).send('无效的漏洞类型');
  }
  
  // 构建控制器文件路径
  const controllerPath = path.join(__dirname, '..', 'controllers', type, `level${level}.js`);
  
  // 检查文件是否存在
  if (!fs.existsSync(controllerPath)) {
    return res.status(404).send('源码文件不存在');
  }
  
  // 读取源码
  fs.readFile(controllerPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('读取源码失败');
    }
    
    res.render('source', {
      title: `${type.toUpperCase()} Level ${level} 源码`,
      sourceCode: data,
      type,
      level,
      activeMenu: type
    });
  });
});

module.exports = router; 