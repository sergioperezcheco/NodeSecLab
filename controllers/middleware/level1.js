// 渲染中间件漏洞Level 1页面
exports.renderPage = (req, res) => {
  res.render('middleware/level1', {
    title: '中间件漏洞 - Level 1 (Express原型污染)',
    activeMenu: 'middleware',
    result: null,
    input: '{}'
  });
};

// 处理中间件漏洞Level 1请求 - 原型污染
exports.processRequest = (req, res) => {
  const { input } = req.body;
  let result = null;
  let parsedInput = null;
  
  try {
    // 不安全地从用户输入解析JSON
    parsedInput = JSON.parse(input || '{}');
    
    // 递归合并对象，不做安全检查，容易导致原型污染
    mergeObjects({}, parsedInput);
    
    result = '成功处理请求！输入已处理。';
    
    // 检查是否发生了原型污染
    if (({}).isAdmin === true) {
      result += ' 警告：检测到原型污染！';
    }
  } catch (error) {
    result = `处理错误: ${error.message}`;
  }
  
  res.render('middleware/level1', {
    title: '中间件漏洞 - Level 1 (Express原型污染)',
    activeMenu: 'middleware',
    result,
    input
  });
};

// 不安全的对象合并，容易导致原型污染
function mergeObjects(target, source) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key]) {
          target[key] = {};
        }
        mergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
} 