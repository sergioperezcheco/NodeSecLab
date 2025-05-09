const path = require('path');

// 渲染文件上传Level 1页面
exports.renderPage = (req, res) => {
  res.render('upload/level1', {
    title: '文件上传 - Level 1',
    activeMenu: 'upload',
    message: null,
    uploadedFile: null
  });
};

// 处理文件上传Level 1
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.render('upload/level1', {
      title: '文件上传 - Level 1',
      activeMenu: 'upload',
      message: '请选择要上传的文件',
      uploadedFile: null
    });
  }
  
  // 不进行任何文件类型验证
  const uploadedFile = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: '/uploads/' + req.file.filename
  };
  
  res.render('upload/level1', {
    title: '文件上传 - Level 1',
    activeMenu: 'upload',
    message: '文件上传成功！',
    uploadedFile
  });
}; 