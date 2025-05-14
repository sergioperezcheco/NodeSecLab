const path = require('path');
const fs = require('fs');

// 渲染文件上传Level 3页面
exports.renderPage = (req, res) => {
  res.render('upload/level3', {
    title: '文件上传 - Level 3',
    activeMenu: 'upload',
    message: null,
    uploadedFile: null
  });
};

// 处理文件上传Level 3
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.render('upload/level3', {
      title: '文件上传 - Level 3',
      activeMenu: 'upload',
      message: '请选择要上传的文件',
      uploadedFile: null
    });
  }
  
  // 检查文件扩展名
  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];
  
  if (!allowedExts.includes(fileExt)) {
    // 删除不允许的文件
    fs.unlinkSync(req.file.path);
    
    return res.render('upload/level3', {
      title: '文件上传 - Level 3',
      activeMenu: 'upload',
      message: '只允许上传图片文件（JPG, JPEG, PNG, GIF）',
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
  
  res.render('upload/level3', {
    title: '文件上传 - Level 3',
    activeMenu: 'upload',
    message: '文件上传成功！',
    uploadedFile
  });
}; 