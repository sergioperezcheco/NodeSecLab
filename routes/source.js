const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/source');

// 显示源代码
router.get('/:category/:level', sourceController.getSource);

module.exports = router; 