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
  // 漏洞类型: 命令执行绕过
  // 漏洞原理: 简单过滤了分号(;)和与号(&)，但没有过滤其他可用于命令执行的特殊字符
  // 题解: 可以使用其他特殊字符来绕过过滤并执行系统命令
  // 绕过方法:
  // 1. 使用反引号(`)执行命令: `whoami`
  // 2. 使用$()执行命令: $(whoami)
  // 3. 使用管道符(|)执行命令: | whoami
  // 4. 使用换行符执行命令
  // 5. 使用通配符绕过过滤
  // 利用示例:
  // 1. 127.0.0.1 | whoami
  // 2. 127.0.0.1 `whoami`
  // 3. 127.0.0.1 $(cat /etc/passwd)
  // 4. 127.0.0.1 || whoami
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