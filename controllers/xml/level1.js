const libxml = require('libxmljs');

// 渲染XML注入Level 1页面
exports.renderPage = (req, res) => {
  res.render('xml/level1', {
    title: 'XML注入 - Level 1',
    activeMenu: 'xml',
    result: null,
    xml: '<user><name>测试</name><role>user</role></user>'
  });
};

// 处理XML注入Level 1请求 - XXE漏洞
exports.processXml = (req, res) => {
  const { xml } = req.body;
  let result = null;
  
  try {
    // 不安全的XML解析，允许外部实体注入
    const xmlDoc = libxml.parseXml(xml, {
      noent: true, // 允许解析外部实体
      dtdload: true // 允许加载外部DTD
    });
    
    // 提取XML中的数据
    const name = xmlDoc.get('//name');
    const role = xmlDoc.get('//role');
    
    if (name && role) {
      result = {
        name: name.text(),
        role: role.text()
      };
    } else {
      result = '无法解析XML或找不到必要的节点';
    }
  } catch (error) {
    result = `解析错误: ${error.message}`;
  }
  
  res.render('xml/level1', {
    title: 'XML注入 - Level 1',
    activeMenu: 'xml',
    result,
    xml
  });
}; 