const path = require('path');
const fs = require('fs');

// 渲染文件上传Level 6页面
exports.renderPage = (req, res) => {
  res.render('upload/level6', {
    title: '文件上传 - Level 6',
    activeMenu: 'upload',
    message: null,
    uploadedFile: null
  });
};

// 处理文件上传Level 6
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.render('upload/level6', {
      title: '文件上传 - Level 6',
      activeMenu: 'upload',
      message: '请选择要上传的文件',
      uploadedFile: null
    });
  }
  
  // 检查MIME类型 - 有漏洞的实现：只检查Content-Type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    // 删除不允许的文件
    fs.unlinkSync(req.file.path);
    
    return res.render('upload/level6', {
      title: '文件上传 - Level 6',
      activeMenu: 'upload',
      message: '只允许上传图片文件（JPG, PNG, GIF）',
      uploadedFile: null
    });
  }
  
  // 文件类型验证通过
  const uploadedFile = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: '/uploads/' + req.file.filename
  };
  
  res.render('upload/level6', {
    title: '文件上传 - Level 6',
    activeMenu: 'upload',
    message: '文件上传成功！',
    uploadedFile
  });
}; 