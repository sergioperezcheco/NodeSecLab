const fs = require('fs');
const path = require('path');

// 渲染文件包含Level 1页面
exports.renderPage = (req, res) => {
  res.render('include/level1', {
    title: '文件包含 - Level 1',
    activeMenu: 'include',
    content: null,
    file: ''
  });
};

// 处理文件包含Level 1请求
exports.includeFile = (req, res) => {
  const file = req.query.file || 'default.txt';
  
  // 不安全的文件包含，没有任何过滤和限制
  try {
    // 创建示例文件夹和文件，确保有文件可以包含
    const includeDir = path.join(__dirname, '../../public/includes');
    if (!fs.existsSync(includeDir)) {
      fs.mkdirSync(includeDir, { recursive: true });
      fs.writeFileSync(path.join(includeDir, 'default.txt'), '这是默认文件内容');
      fs.writeFileSync(path.join(includeDir, 'secret.txt'), '这是机密文件内容，不应该被访问到');
    }
    
    // 不安全的文件读取操作
    const content = fs.readFileSync(path.resolve(file), 'utf8');
    
    res.render('include/level1', {
      title: '文件包含 - Level 1',
      activeMenu: 'include',
      content,
      file
    });
  } catch (error) {
    res.render('include/level1', {
      title: '文件包含 - Level 1',
      activeMenu: 'include',
      content: `错误: ${error.message}`,
      file
    });
  }
}; 