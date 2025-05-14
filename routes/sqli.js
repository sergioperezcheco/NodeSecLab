const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/sqli/level1');
const level2Controller = require('../controllers/sqli/level2');
const level3Controller = require('../controllers/sqli/level3');
const level4Controller = require('../controllers/sqli/level4');
const level5Controller = require('../controllers/sqli/level5');
const level6Controller = require('../controllers/sqli/level6');
const level7Controller = require('../controllers/sqli/level7');

// SQL注入根路径 - 重定向到第一关
router.get('/', (req, res) => {
  res.redirect('/sqli/level1');
});

// SQL注入 Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processQuery);

// SQL注入 Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processQuery);

// SQL注入 Level 3 - 联合查询注入
router.get('/level3', level3Controller.renderPage);
router.post('/level3', level3Controller.processQuery);

// SQL注入 Level 4 - 布尔盲注
router.get('/level4', level4Controller.renderPage);
router.post('/level4', level4Controller.processQuery);

// SQL注入 Level 5 - 时间盲注
router.get('/level5', level5Controller.renderPage);
router.post('/level5', level5Controller.processQuery);

// SQL注入 Level 6 - 二次注入
router.get('/level6', level6Controller.renderPage);
router.post('/level6/register', level6Controller.register);
router.post('/level6/login', level6Controller.login);
router.post('/level6/update', level6Controller.updateProfile);

// SQL注入 Level 7 - 报错注入
router.get('/level7', level7Controller.renderPage);
router.post('/level7', level7Controller.processQuery);

module.exports = router; 