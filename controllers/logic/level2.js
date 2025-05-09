// 渲染业务逻辑漏洞Level 2页面(重放攻击)
exports.renderPage = (req, res) => {
  res.render('logic/level2', {
    title: '业务逻辑漏洞 - Level 2 (重放攻击)',
    activeMenu: 'logic',
    result: null,
    balance: 1000
  });
};

// 模拟的账户数据
const accounts = {
  'user1': { balance: 1000 },
  'user2': { balance: 500 }
};

// 已处理的交易ID
const processedTransactions = new Set();

// 处理转账请求 - 存在重放攻击漏洞
exports.processTransfer = (req, res) => {
  const { fromAccount, toAccount, amount, transactionId } = req.body;
  let result = null;
  
  // 验证参数
  if (!fromAccount || !toAccount || !amount) {
    result = '参数不完整，转账失败';
    return res.render('logic/level2', {
      title: '业务逻辑漏洞 - Level 2 (重放攻击)',
      activeMenu: 'logic',
      result,
      balance: accounts[fromAccount] ? accounts[fromAccount].balance : 0
    });
  }
  
  // 验证账户是否存在
  if (!accounts[fromAccount] || !accounts[toAccount]) {
    result = '账户不存在，转账失败';
    return res.render('logic/level2', {
      title: '业务逻辑漏洞 - Level 2 (重放攻击)',
      activeMenu: 'logic',
      result,
      balance: accounts[fromAccount] ? accounts[fromAccount].balance : 0
    });
  }
  
  // 验证余额是否足够
  if (accounts[fromAccount].balance < parseFloat(amount)) {
    result = '余额不足，转账失败';
    return res.render('logic/level2', {
      title: '业务逻辑漏洞 - Level 2 (重放攻击)',
      activeMenu: 'logic',
      result,
      balance: accounts[fromAccount].balance
    });
  }
  
  // 这里缺少交易ID的验证
  // 正确的实现应该检查交易ID是否已经处理过，防止重放攻击
  /* 
  if (processedTransactions.has(transactionId)) {
    result = '交易已处理，请勿重复提交';
    return res.render('logic/level2', {
      title: '业务逻辑漏洞 - Level 2 (重放攻击)',
      activeMenu: 'logic',
      result,
      balance: accounts[fromAccount].balance
    });
  }
  
  // 记录已处理的交易ID
  processedTransactions.add(transactionId);
  */
  
  // 执行转账
  accounts[fromAccount].balance -= parseFloat(amount);
  accounts[toAccount].balance += parseFloat(amount);
  
  result = `成功从 ${fromAccount} 转账 ${amount} 到 ${toAccount}`;
  
  res.render('logic/level2', {
    title: '业务逻辑漏洞 - Level 2 (重放攻击)',
    activeMenu: 'logic',
    result,
    balance: accounts[fromAccount].balance
  });
}; 