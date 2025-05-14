// 渲染XSS Level 3页面
exports.renderPage = (req, res) => {
  const { name } = req.query;
  
  res.render('xss/level3', {
    title: 'XSS - Level 3',
    activeMenu: 'xss',
    name: name || ''
  });
}; 