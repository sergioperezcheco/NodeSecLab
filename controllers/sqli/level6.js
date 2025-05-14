const db = require('../../config/db');

/*
二次注入 (Second-Order Injection) 解题思路：

1. 二次注入是指攻击者提供的恶意输入在一个地方被存储，但在另一个地方被使用时才产生注入效果
2. 本挑战中，用户可以注册账户，其用户名在注册时看似被正确处理，但在后续更新资料时被不安全地使用

3. 解题步骤：
   a. 首先注册一个带有恶意负载的用户名，例如:
      username: admin'-- -
      password: anypassword
      
   b. 系统会将这个用户名原样存储到数据库中
   
   c. 登录该账户
   
   d. 尝试更新个人资料
      此时后端会使用存储的用户名构造SQL查询，由于没有正确处理用户名中的单引号，导致注入
      
   e. 最终的SQL查询会变成:
      UPDATE users SET email='新邮箱' WHERE username='admin'-- -' AND id=用户ID
      
   f. 这将导致更新admin用户的email，而不是当前登录用户

4. 成功的攻击将修改管理员账户的信息，证明攻击成功

5. 关键点：恶意数据第一次插入时可能被正确转义，但第二次使用时没有再次转义
*/

// 渲染SQL注入Level 6页面
exports.renderPage = (req, res) => {
  res.render('sqli/level6', {
    title: 'SQL注入 - Level 6 (二次注入)',
    activeMenu: 'sqli',
    message: null,
    error: null
  });
};

// 处理用户注册
exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  let message = null;
  let error = null;
  
  try {
    // 检查用户名是否已存在
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    // 使用参数化查询检查用户名是否存在
    const [existUsers] = await pool.execute(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    
    if (existUsers.length > 0) {
      throw new Error('用户名已存在');
    }
    
    // 使用参数化查询插入新用户 - 这是安全的
    await pool.execute(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email]
    );
    
    message = '注册成功，请登录';
  } catch (err) {
    console.error('用户注册错误:', err);
    error = err.message;
  }
  
  res.render('sqli/level6', {
    title: 'SQL注入 - Level 6 (二次注入)',
    activeMenu: 'sqli',
    message,
    error
  });
};

// 处理用户登录
exports.login = async (req, res) => {
  const { username, password } = req.body;
  let user = null;
  let error = null;
  
  try {
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    // 使用参数化查询进行登录验证 - 这是安全的
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (users.length === 0) {
      throw new Error('用户名或密码错误');
    }
    
    user = users[0];
  } catch (err) {
    console.error('用户登录错误:', err);
    error = err.message;
  }
  
  if (user) {
    // 登录成功
    res.render('sqli/level6_profile', {
      title: 'SQL注入 - Level 6 (二次注入)',
      activeMenu: 'sqli',
      user,
      message: '登录成功',
      error: null
    });
  } else {
    res.render('sqli/level6', {
      title: 'SQL注入 - Level 6 (二次注入)',
      activeMenu: 'sqli',
      message: null,
      error
    });
  }
};

// 处理个人资料更新 - 这里存在二次注入漏洞
exports.updateProfile = async (req, res) => {
  const { id, username, newEmail } = req.body;
  let user = null;
  let message = null;
  let error = null;
  
  try {
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    // 危险：不安全地使用用户输入构造SQL查询
    // 这里的username来自数据库，但最初可能包含恶意字符
    const sql = `UPDATE users SET email='${newEmail}' WHERE username='${username}' AND id=${id}`;
    
    await pool.execute(sql);
    
    // 获取更新后的用户信息
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      throw new Error('用户不存在');
    }
    
    user = users[0];
    message = '个人资料更新成功';
    
    // 检查是否更新了admin用户（用于演示攻击成功）
    const [adminUsers] = await pool.execute("SELECT * FROM users WHERE username = 'admin'");
    if (adminUsers.length > 0 && adminUsers[0].email === newEmail) {
      message = '攻击成功！你修改了管理员的邮箱地址！';
    }
  } catch (err) {
    console.error('更新个人资料错误:', err);
    error = err.message;
  }
  
  res.render('sqli/level6_profile', {
    title: 'SQL注入 - Level 6 (二次注入)',
    activeMenu: 'sqli',
    user,
    message,
    error
  });
}; 