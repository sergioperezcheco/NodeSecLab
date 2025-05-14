// 模拟用户数据（实际应用中应该使用数据库）
let user = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com'
};

// 渲染CSRF Level 3页面
exports.renderPage = (req, res) => {
  res.render('csrf/level3', {
    title: 'CSRF - Level 3 (GET型)',
    activeMenu: 'csrf',
    user
  });
};

// 处理GET请求修改邮箱
exports.changeEmail = (req, res) => {
  const { email } = req.query;
  
  // 更新邮箱
  if (email) {
    user.email = email;
  }
  
  res.redirect('/csrf/level3');
}; 