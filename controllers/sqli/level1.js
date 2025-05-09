const db = require('../../config/db');

// 渲染SQL注入Level 1页面
exports.renderPage = (req, res) => {
  res.render('sqli/level1', {
    title: 'SQL注入 - Level 1',
    activeMenu: 'sqli',
    result: null,
    error: null,
    query: ''
  });
};

// 处理SQL注入Level 1查询
exports.processQuery = async (req, res) => {
  const { id } = req.body;
  let result = null;
  let error = null;
  
  try {
    // 不安全的查询 - 直接拼接用户输入
    const sql = `SELECT * FROM users WHERE id = ${id}`;
    
    // 尝试执行查询
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    const [rows] = await pool.execute(sql);
    result = rows;
  } catch (err) {
    console.error('SQL注入Level 1查询错误:', err);
    error = err.message;
  }
  
  res.render('sqli/level1', {
    title: 'SQL注入 - Level 1',
    activeMenu: 'sqli',
    result,
    error,
    query: id
  });
}; 