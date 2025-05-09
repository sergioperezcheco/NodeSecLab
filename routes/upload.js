const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const level1Controller = require('../controllers/upload/level1');
const level2Controller = require('../controllers/upload/level2');

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

module.exports = router; 