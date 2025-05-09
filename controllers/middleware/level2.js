// 渲染中间件漏洞Level 2页面
exports.renderPage = (req, res) => {
  res.render('middleware/level2', {
    title: '中间件漏洞 - Level 2 (Cookie解析漏洞)',
    activeMenu: 'middleware',
    result: null,
    cookie: ''
  });
};

// 处理中间件漏洞Level 2请求 - Cookie解析漏洞
exports.processRequest = (req, res) => {
  const { cookie } = req.body;
  let result = null;
  
  if (!cookie) {
    result = '请输入Cookie字符串';
  } else {
    // 不安全的cookie解析器，容易受到对象注入攻击
    const parsedCookies = parseCookie(cookie);
    
    // 模拟处理解析后的cookie
    result = `成功解析Cookie: ${JSON.stringify(parsedCookies)}`;
    
    // 检查是否存在漏洞利用
    if (parsedCookies.isAdmin) {
      result += '\n用户权限已提升为管理员！';
    }
  }
  
  res.render('middleware/level2', {
    title: '中间件漏洞 - Level 2 (Cookie解析漏洞)',
    activeMenu: 'middleware',
    result,
    cookie
  });
};

// 不安全的cookie解析器
function parseCookie(cookieStr) {
  const cookies = {};
  
  cookieStr.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      let value = pair.substring(idx + 1).trim();
      
      // 尝试解析JSON值
      try {
        if (value.startsWith('{') && value.endsWith('}')) {
          value = JSON.parse(value);
        }
      } catch (e) {
        // 解析失败，保持原始字符串值
      }
      
      // 不安全地将解析后的值赋给对象
      cookies[key] = value;
    }
  });
  
  return cookies;
} 