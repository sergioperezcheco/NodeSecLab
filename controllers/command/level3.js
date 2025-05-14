const { exec } = require('child_process');

// 渲染命令执行Level 3页面
exports.renderPage = (req, res) => {
  res.render('command/level3', {
    title: '命令执行 - Level 3',
    activeMenu: 'command',
    result: null,
    code: ''
  });
};

// 处理命令执行Level 3查询 - JavaScript代码执行漏洞
exports.processCommand = (req, res) => {
  const { code } = req.body;
  let result = null;
  
  // JavaScript代码执行漏洞
  if (code) {
    try {
      // 危险：通过eval直接执行用户输入的JavaScript代码
      // 题解：这里可以输入任意JavaScript代码被eval执行，例如:
      // 1. 获取系统信息: process.env
      // 2. 执行系统命令: require('child_process').execSync('ls -la').toString()
      // 3. 读取文件: require('fs').readFileSync('/etc/passwd', 'utf8')
      result = eval(code);
      
      // 处理对象类型的结果
      if (typeof result === 'object') {
        result = JSON.stringify(result, null, 2);
      }
    } catch (error) {
      result = `执行错误: ${error.message}`;
    }
    
    res.render('command/level3', {
      title: '命令执行 - Level 3',
      activeMenu: 'command',
      result,
      code
    });
  } else {
    res.render('command/level3', {
      title: '命令执行 - Level 3',
      activeMenu: 'command',
      result: '请输入JavaScript代码',
      code: ''
    });
  }
}; 