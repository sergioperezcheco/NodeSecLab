// 渲染业务逻辑漏洞Level 1页面(越权)
exports.renderPage = (req, res) => {
  res.render('logic/level1', {
    title: '业务逻辑漏洞 - Level 1 (越权)',
    activeMenu: 'logic',
    result: null,
    userId: '1'
  });
};

// 模拟的用户数据
const users = [
  { id: 1, username: 'user1', role: 'user', profile: { name: '普通用户', email: 'user1@example.com', phone: '13800000001' } },
  { id: 2, username: 'user2', role: 'user', profile: { name: '普通用户2', email: 'user2@example.com', phone: '13800000002' } },
  { id: 3, username: 'admin', role: 'admin', profile: { name: '管理员', email: 'admin@example.com', phone: '13900000001' } }
];

// 获取用户信息 - 存在水平越权漏洞
exports.getUserInfo = (req, res) => {
  const userId = parseInt(req.query.id || 1);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.json({ success: false, message: '用户不存在' });
  }
  
  // 缺乏权限检查，任何人都可以查看其他用户信息
  // 正确的实现应该检查当前登录用户是否有权限查看请求的用户信息
  
  res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      profile: user.profile
    }
  });
};

// 获取管理员信息 - 存在垂直越权漏洞
exports.getAdminInfo = (req, res) => {
  // 缺乏角色验证，未检查请求用户是否具有admin权限
  // 正确的实现应该验证当前用户是否为管理员
  
  const adminData = {
    adminUsers: users.filter(u => u.role === 'admin'),
    systemSettings: {
      maintenanceMode: false,
      debugMode: true,
      secretKey: 'super_secret_admin_key_123'
    }
  };
  
  res.json({
    success: true,
    data: adminData
  });
}; 