// 模拟用户数据（实际应用中应该使用数据库）
let user = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com'
};

// 生成随机的CSRF令牌
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// 存储CSRF令牌（实际应用中应该使用Redis或会话存储）
let csrfToken = generateToken();

// 渲染CSRF Level 2页面
exports.renderPage = (req, res) => {
  // 重新生成令牌
  csrfToken = generateToken();
  
  res.render('csrf/level2', {
    title: 'CSRF - Level 2',
    activeMenu: 'csrf',
    user,
    csrfToken
  });
};

// 处理修改邮箱请求
exports.changeEmail = (req, res) => {
  const { email, csrf_token } = req.body;
  
  // 检查CSRF令牌
  if (csrf_token !== csrfToken) {
    return res.status(403).send('无效的CSRF令牌');
  }
  
  // 更新邮箱
  user.email = email;
  
  res.redirect('/csrf/level2');
}; 