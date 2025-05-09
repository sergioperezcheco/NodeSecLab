// 模拟用户数据（实际应用中应该使用数据库）
let user = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com'
};

// 渲染CSRF Level 1页面
exports.renderPage = (req, res) => {
  res.render('csrf/level1', {
    title: 'CSRF - Level 1',
    activeMenu: 'csrf',
    user
  });
};

// 处理修改邮箱请求
exports.changeEmail = (req, res) => {
  const { email } = req.body;
  
  // 更新邮箱
  user.email = email;
  
  res.redirect('/csrf/level1');
}; 