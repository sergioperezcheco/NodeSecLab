const fs = require('fs');
const path = require('path');

// 渲染文件包含Level 2页面
exports.renderPage = (req, res) => {
  res.render('include/level2', {
    title: '文件包含 - Level 2',
    activeMenu: 'include',
    content: null,
    file: ''
  });
};

// 处理文件包含Level 2请求 - 尝试进行简单过滤
exports.includeFile = (req, res) => {
  let file = req.query.file || 'default.txt';
  
  // 创建示例文件
  const includeDir = path.join(__dirname, '../../public/includes');
  if (!fs.existsSync(includeDir)) {
    fs.mkdirSync(includeDir, { recursive: true });
    fs.writeFileSync(path.join(includeDir, 'default.txt'), '这是默认文件内容');
    fs.writeFileSync(path.join(includeDir, 'secret.txt'), '这是机密文件内容，不应该被访问到');
  }
  
  // 尝试进行简单的安全过滤，但仍然有漏洞
  if (file.includes('../') || file.includes('..\\')) {
    file = 'default.txt';
  }

  try {
    // 错误的安全实现，仍然可以被绕过
    // 如果使用编码方式如 ..%2f 可能会绕过上面的检查
    const filePath = path.join(includeDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    res.render('include/level2', {
      title: '文件包含 - Level 2',
      activeMenu: 'include',
      content,
      file
    });
  } catch (error) {
    res.render('include/level2', {
      title: '文件包含 - Level 2',
      activeMenu: 'include',
      content: `错误: ${error.message}`,
      file
    });
  }
}; 