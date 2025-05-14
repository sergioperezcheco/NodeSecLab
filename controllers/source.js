const fs = require('fs');
const path = require('path');

// 命令执行命令
const commandSources = {
  1: '/controllers/command/level1.js',
  2: '/controllers/command/level2.js',
  3: '/controllers/command/level3.js',
  4: '/controllers/command/level4.js',
  5: '/controllers/command/level5.js'
};

// 文件包含
const includeSources = {
  1: '/controllers/include/level1.js',
  2: '/controllers/include/level2.js'
};

// XML注入
const xmlSources = {
  1: '/controllers/xml/level1.js',
  2: '/controllers/xml/level2.js'
};

// 逻辑漏洞
const logicSources = {
  1: '/controllers/logic/level1.js',
  2: '/controllers/logic/level2.js'
};

// 中间件漏洞
const middlewareSources = {
  1: '/controllers/middleware/level1.js',
  2: '/controllers/middleware/level2.js'
};

// SQL注入
const sqliSources = {
  1: '/controllers/sqli/level1.js',
  2: '/controllers/sqli/level2.js'
};

// XSS
const xssSources = {
  1: '/controllers/xss/level1.js',
  2: '/controllers/xss/level2.js'
};

// CSRF
const csrfSources = {
  1: '/controllers/csrf/level1.js',
  2: '/controllers/csrf/level2.js'
};

// 文件上传
const uploadSources = {
  1: '/controllers/upload/level1.js',
  2: '/controllers/upload/level2.js'
};

// 文件下载
const downloadSources = {
  1: '/controllers/download/level1.js',
  2: '/controllers/download/level2.js'
};

// 获取源代码
exports.getSource = (req, res) => {
  const { category, level } = req.params;
  let sourcePath;

  // 根据不同类型获取源码路径
  switch (category) {
    case 'command':
      sourcePath = commandSources[level];
      break;
    case 'include':
      sourcePath = includeSources[level];
      break;
    case 'xml':
      sourcePath = xmlSources[level];
      break;
    case 'logic':
      sourcePath = logicSources[level];
      break;
    case 'middleware':
      sourcePath = middlewareSources[level];
      break;
    case 'sqli':
      sourcePath = sqliSources[level];
      break;
    case 'xss':
      sourcePath = xssSources[level];
      break;
    case 'csrf':
      sourcePath = csrfSources[level];
      break;
    case 'upload':
      sourcePath = uploadSources[level];
      break;
    case 'download':
      sourcePath = downloadSources[level];
      break;
    default:
      return res.status(404).render('error', {
        message: '未找到对应的源代码',
        error: { status: 404 }
      });
  }

  if (!sourcePath) {
    return res.status(404).render('error', {
      message: '未找到对应的源代码',
      error: { status: 404 }
    });
  }

  // 读取源码文件
  try {
    const source = fs.readFileSync(path.join(__dirname, '..', sourcePath), 'utf8');
    
    // 将源码进行高亮显示
    res.render('source', {
      title: `${category.toUpperCase()} - Level ${level} 源码`,
      activeMenu: category,
      source,
      category,
      level
    });
  } catch (error) {
    console.error('读取源码失败:', error);
    res.status(500).render('error', {
      message: '读取源码失败',
      error
    });
  }
}; 