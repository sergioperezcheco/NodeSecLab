const path = require('path');
const fs = require('fs');

// 渲染文件下载Level 1页面
exports.renderPage = (req, res) => {
  // 获取可下载文件列表
  const filesDir = path.join(__dirname, '../../public/downloads');
  let files = [];
  
  try {
    if (fs.existsSync(filesDir)) {
      files = fs.readdirSync(filesDir).filter(file => {
        return fs.statSync(path.join(filesDir, file)).isFile();
      });
    } else {
      // 创建下载目录
      fs.mkdirSync(filesDir, { recursive: true });
      
      // 创建一些示例文件
      fs.writeFileSync(path.join(filesDir, 'example1.txt'), '这是示例文件1的内容');
      fs.writeFileSync(path.join(filesDir, 'example2.txt'), '这是示例文件2的内容');
      fs.writeFileSync(path.join(filesDir, 'secret.txt'), '这是一个秘密文件，不应该被下载');
      
      files = ['example1.txt', 'example2.txt', 'secret.txt'];
    }
  } catch (error) {
    console.error('读取文件列表失败:', error);
  }
  
  res.render('download/level1', {
    title: '文件下载 - Level 1',
    activeMenu: 'download',
    files
  });
};

// 处理文件下载Level 1
exports.downloadFile = (req, res) => {
  const { file } = req.query;
  
  if (!file) {
    return res.status(400).send('未指定文件名');
  }
  
  // 不安全的实现：直接拼接文件路径，没有进行路径验证
  const filePath = path.join(__dirname, '../../public/downloads', file);
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('文件不存在');
  }
  
  // 发送文件
  res.download(filePath);
}; 