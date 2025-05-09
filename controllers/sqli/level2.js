const db = require('../../config/db');

// 渲染SQL注入Level 2页面
exports.renderPage = (req, res) => {
  res.render('sqli/level2', {
    title: 'SQL注入 - Level 2',
    activeMenu: 'sqli',
    result: null,
    error: null,
    username: ''
  });
};

// 处理SQL注入Level 2查询
exports.processQuery = async (req, res) => {
  const { username } = req.body;
  let result = null;
  let error = null;
  
  try {
    // 不安全的查询 - 使用单引号包裹但未转义
    const sql = `SELECT * FROM users WHERE username = '${username}'`;
    
    // 尝试执行查询
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    const [rows] = await pool.execute(sql);
    result = rows;
  } catch (err) {
    console.error('SQL注入Level 2查询错误:', err);
    error = err.message;
  }
  
  res.render('sqli/level2', {
    title: 'SQL注入 - Level 2',
    activeMenu: 'sqli',
    result,
    error,
    username
  });
}; 