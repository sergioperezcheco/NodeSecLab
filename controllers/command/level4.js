const ejs = require('ejs');

// 渲染命令执行Level 4页面
exports.renderPage = (req, res) => {
  res.render('command/level4', {
    title: '命令执行 - Level 4',
    activeMenu: 'command',
    result: null,
    template: ''
  });
};

// 处理命令执行Level 4查询 - 模板注入漏洞
exports.processCommand = (req, res) => {
  const { template } = req.body;
  let result = null;
  
  // 模板注入漏洞
  if (template) {
    try {
      // 危险：直接使用用户输入的数据作为模板渲染
      // 题解：这里可以利用EJS模板特性执行任意代码，例如:
      // 1. <%= process.env %> - 获取环境变量
      // 2. <%= global.process.mainModule.require('child_process').execSync('ls -la') %> - 执行系统命令
      // 3. <%= global.process.mainModule.require('fs').readFileSync('/etc/passwd') %> - 读取文件
      result = ejs.render(template, {});
    } catch (error) {
      result = `渲染错误: ${error.message}`;
    }
    
    res.render('command/level4', {
      title: '命令执行 - Level 4',
      activeMenu: 'command',
      result,
      template
    });
  } else {
    res.render('command/level4', {
      title: '命令执行 - Level 4',
      activeMenu: 'command',
      result: '请输入EJS模板代码',
      template: ''
    });
  }
}; 