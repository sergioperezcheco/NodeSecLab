const libxml = require('libxmljs');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

// 渲染XML注入Level 2页面
exports.renderPage = (req, res) => {
  res.render('xml/level2', {
    title: 'XML注入 - Level 2',
    activeMenu: 'xml',
    result: null,
    query: 'user'
  });
};

// 处理XML注入Level 2请求 - XPath注入漏洞
exports.processXml = (req, res) => {
  const { query } = req.body;
  let result = null;
  
  // 模拟的XML数据
  const xmlData = `
    <users>
      <user id="1">
        <username>admin</username>
        <password>admin123</password>
        <role>administrator</role>
      </user>
      <user id="2">
        <username>user</username>
        <password>user123</password>
        <role>user</role>
      </user>
      <user id="3">
        <username>guest</username>
        <password>guest</password>
        <role>guest</role>
      </user>
    </users>
  `;
  
  try {
    // 不安全的XPath查询，容易受到XPath注入攻击
    const doc = new dom().parseFromString(xmlData);
    const xpathQuery = `//user[contains(username, '${query}')]`;
    
    // 执行XPath查询
    const nodes = xpath.select(xpathQuery, doc);
    
    if (nodes.length > 0) {
      result = [];
      for (let i = 0; i < nodes.length; i++) {
        const username = xpath.select('string(./username)', nodes[i]);
        const role = xpath.select('string(./role)', nodes[i]);
        
        result.push({ username, role });
      }
    } else {
      result = '没有找到匹配的用户';
    }
  } catch (error) {
    result = `查询错误: ${error.message}`;
  }
  
  res.render('xml/level2', {
    title: 'XML注入 - Level 2',
    activeMenu: 'xml',
    result,
    query
  });
}; 