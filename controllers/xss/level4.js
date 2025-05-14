// 渲染XSS Level 4页面
exports.renderPage = (req, res) => {
  const { name } = req.query;
  
  // 不安全的渲染函数
  function render(input) {
    return '<input type="text" value="' + input + '">';
  }
  
  res.render('xss/level4', {
    title: 'XSS - Level 4',
    activeMenu: 'xss',
    name: name || '',
    renderedInput: name ? render(name) : ''
  });
};

// 处理XSS Level 4输入
exports.processInput = (req, res) => {
  const { name } = req.body;
  
  // 重定向到带有查询参数的GET请求
  res.redirect(`/xss/level4?name=${encodeURIComponent(name)}`);
}; 