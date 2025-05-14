// 渲染XSS Level 6页面
exports.renderPage = (req, res) => {
  const { style } = req.query;
  
  // 不安全的样式处理函数
  function render(src) {
    if (!src) return '';
    // 尝试过滤掉style标签结束符，但处理不完整
    src = src.replace(/<\/style>/ig, '/* \u574F\u4EBA */');
    return `
      <style>
        ${src}
      </style>
    `;
  }
  
  const styledContent = style ? render(style) : '';
  
  res.render('xss/level6', {
    title: 'XSS - Level 6',
    activeMenu: 'xss',
    style: style || '',
    styledContent
  });
};

// 处理XSS Level 6输入
exports.processInput = (req, res) => {
  const { style } = req.body;
  
  // 重定向到带有查询参数的GET请求
  res.redirect(`/xss/level6?style=${encodeURIComponent(style)}`);
}; 