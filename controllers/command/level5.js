const { exec } = require('child_process');
const serialize = require('node-serialize');

// 渲染命令执行Level 5页面
exports.renderPage = (req, res) => {
  res.render('command/level5', {
    title: '命令执行 - Level 5',
    activeMenu: 'command',
    result: null,
    payload: ''
  });
};

// 处理命令执行Level 5查询 - 不安全的反序列化漏洞
exports.processCommand = (req, res) => {
  const { payload } = req.body;
  let result = null;
  
  // 反序列化漏洞
  if (payload) {
    try {
      // 危险：直接反序列化用户输入的数据
      // 题解：这里可以利用Node.js中不安全的反序列化执行任意代码，例如构造以下payload:
      // {"rce":"_$$ND_FUNC$$_function(){require('child_process').execSync('命令')}()"}
      // 上面的payload中包含一个立即执行函数(IIFE)，反序列化时会自动执行
      const deserializedData = serialize.unserialize(payload);
      result = '反序列化成功：' + JSON.stringify(deserializedData, null, 2);
    } catch (error) {
      result = `反序列化错误: ${error.message}`;
    }
    
    res.render('command/level5', {
      title: '命令执行 - Level 5',
      activeMenu: 'command',
      result,
      payload
    });
  } else {
    res.render('command/level5', {
      title: '命令执行 - Level 5',
      activeMenu: 'command',
      result: '请输入序列化数据',
      payload: ''
    });
  }
}; 