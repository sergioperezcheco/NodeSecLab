const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/logic/level1');
const level2Controller = require('../controllers/logic/level2');

// 业务逻辑漏洞 Level 1 (越权)
router.get('/level1', level1Controller.renderPage);
router.get('/level1/user', level1Controller.getUserInfo);
router.get('/level1/admin', level1Controller.getAdminInfo);

// 业务逻辑漏洞 Level 2 (重放攻击)
router.get('/level2', level2Controller.renderPage);
router.post('/level2/transfer', level2Controller.processTransfer);

module.exports = router; 