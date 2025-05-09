const { exec } = require('child_process');

// 渲染命令执行Level 1页面
exports.renderPage = (req, res) => {
  res.render('command/level1', {
    title: '命令执行 - Level 1',
    activeMenu: 'command',
    result: null,
    command: ''
  });
};

// 处理命令执行Level 1查询
exports.processCommand = (req, res) => {
  const { command } = req.body;
  let result = null;
  
  // 不安全的命令执行 - 直接执行用户输入
  if (command) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        result = `执行错误: ${error.message}`;
      } else if (stderr) {
        result = `stderr: ${stderr}`;
      } else {
        result = stdout;
      }
      
      res.render('command/level1', {
        title: '命令执行 - Level 1',
        activeMenu: 'command',
        result,
        command
      });
    });
  } else {
    res.render('command/level1', {
      title: '命令执行 - Level 1',
      activeMenu: 'command',
      result: '请输入命令',
      command: ''
    });
  }
}; 