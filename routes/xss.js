const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/xss/level1');
const level2Controller = require('../controllers/xss/level2');
const level3Controller = require('../controllers/xss/level3');
const level4Controller = require('../controllers/xss/level4');
const level5Controller = require('../controllers/xss/level5');
const level6Controller = require('../controllers/xss/level6');

// XSS Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processInput);

// XSS Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processInput);
router.get('/level2/messages', level2Controller.getMessages);

// XSS Level 3 - URL参数XSS
router.get('/level3', level3Controller.renderPage);

// XSS Level 4 - 输入框value属性XSS
router.get('/level4', level4Controller.renderPage);
router.post('/level4', level4Controller.processInput);

// XSS Level 5 - 过滤绕过XSS
router.get('/level5', level5Controller.renderPage);
router.post('/level5', level5Controller.processInput);

// XSS Level 6 - Style标签XSS
router.get('/level6', level6Controller.renderPage);
router.post('/level6', level6Controller.processInput);

module.exports = router; 