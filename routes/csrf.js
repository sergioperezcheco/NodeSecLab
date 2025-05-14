const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/csrf/level1');
const level2Controller = require('../controllers/csrf/level2');
const level3Controller = require('../controllers/csrf/level3');

// CSRF Level 1 (POST型)
router.get('/level1', level1Controller.renderPage);
router.post('/level1/change-email', level1Controller.changeEmail);

// CSRF Level 2 (Token型)
router.get('/level2', level2Controller.renderPage);
router.post('/level2/change-email', level2Controller.changeEmail);

// CSRF Level 3 (GET型)
router.get('/level3', level3Controller.renderPage);
router.get('/level3/change-email', level3Controller.changeEmail);

module.exports = router; 