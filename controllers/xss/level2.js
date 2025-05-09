// 存储消息的数组（实际应用中应该使用数据库）
const messages = [];

// 渲染XSS Level 2页面
exports.renderPage = (req, res) => {
  res.render('xss/level2', {
    title: 'XSS - Level 2',
    activeMenu: 'xss'
  });
};

// 处理XSS Level 2输入
exports.processInput = (req, res) => {
  const { name, message } = req.body;
  
  // 存储消息（不进行任何过滤）
  messages.push({
    name,
    message,
    time: new Date()
  });
  
  res.redirect('/xss/level2');
};

// 获取所有消息
exports.getMessages = (req, res) => {
  res.json(messages);
}; 