// 渲染XSS Level 5页面
exports.renderPage = (req, res) => {
  const { name } = req.query;
  
  // 不安全的过滤函数，只过滤了圆括号
  function render(input) {
    if (!input) return '';
    const stripBracketsRe = /[()]/g;
    return input.replace(stripBracketsRe, '');
  }
  
  const processedInput = name ? render(name) : '';
  
  res.render('xss/level5', {
    title: 'XSS - Level 5',
    activeMenu: 'xss',
    name: name || '',
    processedInput
  });
};

// 处理XSS Level 5输入
exports.processInput = (req, res) => {
  const { name } = req.body;
  
  // 重定向到带有查询参数的GET请求
  res.redirect(`/xss/level5?name=${encodeURIComponent(name)}`);
}; 