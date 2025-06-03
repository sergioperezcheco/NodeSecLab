const express = require('express');
const router = express.Router();

// 获取AI助手配置
router.get('/ai-config', (req, res) => {
  try {
    const config = {
      enabled: process.env.AI_CHAT_ENABLED === 'true',
      baseUrl: process.env.AI_CHAT_BASE_URL || '',
      apiKey: process.env.AI_CHAT_API_KEY || '',
      model: process.env.AI_CHAT_MODEL || 'gpt-4o'
    };
    
    res.json(config);
  } catch (error) {
    console.error('获取AI配置失败:', error);
    res.status(500).json({ 
      error: '获取AI配置失败',
      enabled: false 
    });
  }
});

module.exports = router; 