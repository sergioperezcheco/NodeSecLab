document.addEventListener('DOMContentLoaded', function() {
  // 配置信息
  const apiConfig = {
    baseUrl: 'https://apikey.checo.icu',
    apiKey: 'sk-yEvkHFrn45wWTGhMHGiXkF7Hh1b8FMPn6bWauzSNuz4nkiBa',
    model: 'gpt-4o'
  };
  
  // 获取DOM元素
  const chatToggle = document.querySelector('.ai-chat-toggle');
  const chatContainer = document.querySelector('.ai-chat-container');
  const chatMessages = document.querySelector('.ai-chat-messages');
  const chatInput = document.querySelector('.ai-chat-input');
  const chatSend = document.querySelector('.ai-chat-send');
  const chatClose = document.querySelector('.ai-chat-close');
  
  // 聊天记录
  let chatHistory = [];
  
  // 切换聊天窗口显示/隐藏
  if (chatToggle) {
    chatToggle.addEventListener('click', function() {
      chatContainer.classList.toggle('open');
    });
  }
  
  // 关闭聊天窗口
  if (chatClose) {
    chatClose.addEventListener('click', function() {
      chatContainer.classList.remove('open');
    });
  }
  
  // 发送消息
  const sendMessage = async () => {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // 添加用户消息到聊天界面
    addMessageToChat('user', message);
    
    // 清空输入框
    chatInput.value = '';
    
    // 显示加载动画
    const loadingEl = document.createElement('div');
    loadingEl.className = 'ai-chat-loading';
    loadingEl.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(loadingEl);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
      // 更新聊天历史
      chatHistory.push({ role: 'user', content: message });
      
      // 调用API获取回复
      const response = await callChatAPI(chatHistory);
      
      // 移除加载动画
      if (loadingEl) {
        loadingEl.remove();
      }
      
      // 显示API响应
      if (response) {
        // 添加AI回复到聊天历史
        chatHistory.push({ role: 'assistant', content: response });
        
        // 添加AI回复到聊天界面
        addMessageToChat('bot', response);
      }
    } catch (error) {
      console.error('API 请求错误:', error);
      
      // 移除加载动画
      if (loadingEl) {
        loadingEl.remove();
      }
      
      // 显示错误消息
      addMessageToChat('bot', '抱歉，发生了错误，请稍后再试。');
    }
  };
  
  // 添加消息到聊天界面
  const addMessageToChat = (type, text) => {
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${type}`;
    
    // 添加消息文本
    messageEl.innerHTML = text;
    
    // 添加时间戳
    const timeEl = document.createElement('div');
    timeEl.className = 'ai-message-time';
    const now = new Date();
    timeEl.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    messageEl.appendChild(timeEl);
    
    // 添加到聊天窗口
    chatMessages.appendChild(messageEl);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
  
  // 调用聊天API
  const callChatAPI = async (messages) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages: messages,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API调用错误:', error);
      throw error;
    }
  };
  
  // 绑定事件
  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}); 