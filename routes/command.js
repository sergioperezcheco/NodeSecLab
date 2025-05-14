const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/command/level1');
const level2Controller = require('../controllers/command/level2');
const level3Controller = require('../controllers/command/level3');
const level4Controller = require('../controllers/command/level4');
const level5Controller = require('../controllers/command/level5');

// 命令执行 Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processCommand);

// 命令执行 Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processCommand);

// 命令执行 Level 3 - JavaScript代码执行
router.get('/level3', level3Controller.renderPage);
router.post('/level3', level3Controller.processCommand);

// 命令执行 Level 4 - 模板注入
router.get('/level4', level4Controller.renderPage);
router.post('/level4', level4Controller.processCommand);

// 命令执行 Level 5 - 反序列化漏洞
router.get('/level5', level5Controller.renderPage);
router.post('/level5', level5Controller.processCommand);

module.exports = router; 