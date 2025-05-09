// 渲染XSS Level 1页面
exports.renderPage = (req, res) => {
  const { name } = req.query;
  
  res.render('xss/level1', {
    title: 'XSS - Level 1',
    activeMenu: 'xss',
    name: name || ''
  });
};

// 处理XSS Level 1输入
exports.processInput = (req, res) => {
  const { name } = req.body;
  
  // 重定向到带有查询参数的GET请求
  res.redirect(`/xss/level1?name=${encodeURIComponent(name)}`);
}; 