const { exec } = require('child_process');

// 渲染命令执行Level 2页面
exports.renderPage = (req, res) => {
  res.render('command/level2', {
    title: '命令执行 - Level 2',
    activeMenu: 'command',
    result: null,
    command: ''
  });
};

// 处理命令执行Level 2查询 - 尝试进行简单过滤
exports.processCommand = (req, res) => {
  const { command } = req.body;
  let result = null;
  
  // 尝试过滤危险字符，但过滤不完全
  if (command) {
    // 简单过滤，但可以绕过
    let sanitizedCommand = command.replace(/;/g, '').replace(/&/g, '');
    
    // 仍然存在命令注入漏洞
    const cmd = `ping -c 4 ${sanitizedCommand}`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        result = `执行错误: ${error.message}`;
      } else if (stderr) {
        result = `stderr: ${stderr}`;
      } else {
        result = stdout;
      }
      
      res.render('command/level2', {
        title: '命令执行 - Level 2',
        activeMenu: 'command',
        result,
        command
      });
    });
  } else {
    res.render('command/level2', {
      title: '命令执行 - Level 2',
      activeMenu: 'command',
      result: '请输入命令',
      command: ''
    });
  }
}; 