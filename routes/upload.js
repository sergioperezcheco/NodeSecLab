const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const level1Controller = require('../controllers/upload/level1');
const level2Controller = require('../controllers/upload/level2');
const level3Controller = require('../controllers/upload/level3');
const level4Controller = require('../controllers/upload/level4');
const level5Controller = require('../controllers/upload/level5');
const level6Controller = require('../controllers/upload/level6');

// 配置文件上传存储
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 文件上传 Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', upload.single('file'), level1Controller.uploadFile);

// 文件上传 Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', upload.single('file'), level2Controller.uploadFile);

// 文件上传 Level 3 - 前端JS验证
router.get('/level3', level3Controller.renderPage);
router.post('/level3', upload.single('file'), level3Controller.uploadFile);

// 文件上传 Level 4 - 大小写后缀绕过
router.get('/level4', level4Controller.renderPage);
router.post('/level4', upload.single('file'), level4Controller.uploadFile);

// 文件上传 Level 5 - 双写后缀绕过
router.get('/level5', level5Controller.renderPage);
router.post('/level5', upload.single('file'), level5Controller.uploadFile);

// 文件上传 Level 6 - content-type绕过
router.get('/level6', level6Controller.renderPage);
router.post('/level6', upload.single('file'), level6Controller.uploadFile);

// 清空上传文件夹的路由
router.post('/clear-uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, '../public/uploads');
  
  try {
    // 读取uploads目录下的所有文件
    const files = fs.readdirSync(uploadsDir);
    
    // 删除每个文件
    for (const file of files) {
      fs.unlinkSync(path.join(uploadsDir, file));
    }
    
    res.json({ success: true, message: '上传文件夹已清空' });
  } catch (error) {
    console.error('清空文件夹错误:', error);
    res.status(500).json({ success: false, message: '清空文件夹时出错' });
  }
});

module.exports = router; 