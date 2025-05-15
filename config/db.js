const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'web_security_lab'
};

// 创建连接池
let pool = null;

// 添加全局状态标记数据库是否可用
let isDbAvailable = false;

// 初始化数据库
async function initDb() {
  try {
    console.log('正在连接数据库，配置信息:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    // 首先创建没有指定数据库的连接
    const tempPool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      connectTimeout: 10000, // 增加连接超时时间
      waitForConnections: true,
      connectionLimit: 5
    });

    // 检查数据库是否存在，如果不存在则创建
    try {
      const [rows] = await tempPool.execute(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbConfig.database}'`
      );

      if (rows.length === 0) {
        console.log(`创建数据库 ${dbConfig.database}`);
        await tempPool.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
      }

      // 关闭临时连接池
      await tempPool.end();
    } catch (err) {
      console.error('检查/创建数据库失败:', err);
      if (tempPool) await tempPool.end();
      throw err;
    }

    // 创建正式连接池
    pool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000, // 增加连接超时时间
      debug: process.env.NODE_ENV === 'development' // 开发环境启用调试
    });

    // 测试连接
    const connection = await pool.getConnection();
    connection.release();
    
    // 初始化表
    await initTables();
    
    console.log('数据库连接成功');
    isDbAvailable = true;
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    isDbAvailable = false;
    return false;
  }
}

// 初始化表
async function initTables() {
  try {
    // 用户表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 文章表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        author VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 消息表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入一些示例数据
    const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO users (username, password, email) VALUES
        ('admin', 'admin123', 'admin@example.com'),
        ('user1', 'password123', 'user1@example.com'),
        ('user2', 'password456', 'user2@example.com')
      `);
    }

    const [articleRows] = await pool.execute('SELECT COUNT(*) as count FROM articles');
    if (articleRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO articles (title, content, author) VALUES
        ('第一篇文章', '这是第一篇文章的内容', 'admin'),
        ('安全编程', '如何编写安全的代码', 'user1'),
        ('Web安全', 'Web安全最佳实践', 'user2')
      `);
    }

    const [messageRows] = await pool.execute('SELECT COUNT(*) as count FROM messages');
    if (messageRows[0].count === 0) {
      await pool.execute(`
        INSERT INTO messages (name, message) VALUES
        ('访客1', '你好，这是一条测试消息'),
        ('访客2', '这个网站很棒！'),
        ('访客3', '我发现了一个bug')
      `);
    }

    console.log('数据库表初始化完成');
  } catch (error) {
    console.error('初始化表失败:', error);
    throw error;
  }
}

// 获取数据库连接池
function getPool() {
  if (!isDbAvailable) {
    return null;
  }
  return pool;
}

// 执行SQL查询
async function query(sql, params) {
  try {
    if (!isDbAvailable || !pool) {
      throw new Error('数据库未连接或不可用');
    }
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('查询执行失败:', error);
    throw error;
  }
}

// 检查数据库是否可用
function isDatabaseAvailable() {
  return isDbAvailable;
}

module.exports = {
  initDb,
  getPool,
  query,
  dbConfig,
  isDatabaseAvailable
}; 