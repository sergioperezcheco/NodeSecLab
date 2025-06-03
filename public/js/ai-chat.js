document.addEventListener('DOMContentLoaded', function() {
  // 配置信息 - 将从API动态获取
  let apiConfig = {
    baseUrl: '',
    apiKey: '',
    model: 'gpt-4o',
    enabled: false
  };
  
  // 获取DOM元素
  const chatToggle = document.querySelector('.ai-chat-toggle');
  const chatContainer = document.querySelector('.ai-chat-container');
  const chatMessages = document.querySelector('.ai-chat-messages');
  const chatInput = document.querySelector('.ai-chat-input');
  const chatSend = document.querySelector('.ai-chat-send');
  const chatClose = document.querySelector('.ai-chat-close');
  
  // 异步初始化AI配置
  const initAIConfig = async () => {
    try {
      const response = await fetch('/api/ai-config');
      const config = await response.json();
      
      if (config.enabled) {
        apiConfig = {
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
          model: config.model,
          enabled: config.enabled
        };
        
        // 显示AI助手按钮
        if (chatToggle) {
          chatToggle.style.display = 'block';
        }
      } else {
        // 隐藏AI助手按钮
        if (chatToggle) {
          chatToggle.style.display = 'none';
        }
        console.log('AI助手已禁用');
      }
    } catch (error) {
      console.error('获取AI配置失败:', error);
      // 隐藏AI助手按钮
      if (chatToggle) {
        chatToggle.style.display = 'none';
      }
    }
  };
  
  // 初始化AI配置
  initAIConfig();
  
  // 设置欢迎消息的实时时间
  const welcomeTimeElement = document.getElementById('welcome-message-time');
  if (welcomeTimeElement) {
    const now = new Date();
    welcomeTimeElement.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 聊天记录
  let chatHistory = [];
  
  // 自动滚动控制
  let autoScrollInterval = null;
  
  // 启动自动滚动（定时持续滚动到底部）
  const startAutoScroll = () => {
    // 先清除可能已存在的滚动定时器
    stopAutoScroll();
    
    // 创建新的滚动定时器，每100ms滚动一次
    autoScrollInterval = setInterval(() => {
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  };
  
  // 停止自动滚动
  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };
  
  // 滚动到底部的函数
  const scrollToBottom = () => {
    if (chatMessages) {
      // 立即滚动一次
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // 再次在下一帧滚动，确保在DOM更新后
      requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  };
  
  // 强制滚动到底部
  const forceScrollToBottom = scrollToBottom;
  
  // 切换聊天窗口显示/隐藏
  if (chatToggle) {
    chatToggle.addEventListener('click', function() {
      chatContainer.classList.toggle('open');
      // 如果窗口被打开，滚动到底部
      if (chatContainer.classList.contains('open')) {
        forceScrollToBottom();
      }
    });
  }
  
  // 关闭聊天窗口
  if (chatClose) {
    chatClose.addEventListener('click', function() {
      chatContainer.classList.remove('open');
      // 关闭窗口时停止自动滚动
      stopAutoScroll();
    });
  }
  
  // 发送消息
  const sendMessage = async () => {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // 检查AI助手是否启用和配置是否完整
    if (!apiConfig.enabled || !apiConfig.baseUrl || !apiConfig.apiKey) {
      console.error('AI助手配置不完整或已禁用');
      return;
    }
    
    // 添加用户消息到聊天界面
    addMessageToChat('user', message);
    
    // 清空输入框
    chatInput.value = '';
    
    // 更新聊天历史
    chatHistory.push({ role: 'user', content: message });
    
    // 创建助手消息元素，准备流式响应
    const botMessageEl = createBotMessageElement();
    
    try {
      // 启动自动滚动，在流式响应期间持续滚动
      startAutoScroll();
      
      // 调用API获取流式响应
      await streamChatResponse(chatHistory, botMessageEl);
      
      // 完成后，获取生成的完整内容并添加到聊天历史
      const generatedContent = botMessageEl.textContent;
      chatHistory.push({ role: 'assistant', content: generatedContent });
      
      // 确保滚动到底部
      forceScrollToBottom();
      
      // 停止自动滚动
      stopAutoScroll();
    } catch (error) {
      console.error('API 请求错误:', error);
      
      // 显示错误消息
      botMessageEl.innerHTML = marked.parse('抱歉，发生了错误，请稍后再试。');
      addTimeToMessage(botMessageEl);
      forceScrollToBottom();
      
      // 停止自动滚动
      stopAutoScroll();
    }
  };
  
  // 创建一个机器人消息元素
  const createBotMessageElement = () => {
    const messageEl = document.createElement('div');
    messageEl.className = 'ai-message bot';
    chatMessages.appendChild(messageEl);
    
    // 滚动到底部
    forceScrollToBottom();
    
    return messageEl;
  };
  
  // 添加用户消息到聊天界面
  const addMessageToChat = (type, text) => {
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ${type}`;
    
    // 添加消息文本
    messageEl.textContent = text;
    
    // 添加时间戳
    addTimeToMessage(messageEl);
    
    // 添加到聊天窗口
    chatMessages.appendChild(messageEl);
    
    // 滚动到底部
    forceScrollToBottom();
  };
  
  // 添加时间戳到消息
  const addTimeToMessage = (messageEl) => {
    const timeEl = document.createElement('div');
    timeEl.className = 'ai-message-time';
    const now = new Date();
    timeEl.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    messageEl.appendChild(timeEl);
  };
  
  // 流式调用聊天API
  const streamChatResponse = async (messages, messageElement) => {
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
          max_tokens: 2000,
          stream: true // 启用流式输出
        })
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      // 获取响应的reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let content = '';
      let buffer = '';
      
      // 处理流式数据
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // 解码当前数据块
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // 处理数据行
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        let contentUpdated = false;
        
        for (const line of lines) {
          if (!line.trim() || line.trim() === 'data: [DONE]') continue;
          
          try {
            // 解析SSE数据行
            const dataMatch = line.match(/^data: (.+)$/);
            if (!dataMatch) continue;
            
            const data = JSON.parse(dataMatch[1]);
            const delta = data.choices[0].delta;
            
            // 如果有新内容，添加到消息中
            if (delta && delta.content) {
              content += delta.content;
              // 使用Markdown渲染内容
              messageElement.innerHTML = marked.parse(content);
              // 重新添加时间戳，因为innerHTML会覆盖
              addTimeToMessage(messageElement);
              contentUpdated = true;
            }
          } catch (e) {
            console.error('解析SSE数据错误:', e, line);
          }
        }
        
        // 确保自动滚动处于激活状态
        if (contentUpdated) {
          if (!autoScrollInterval) {
            startAutoScroll();
          }
        }
      }
      
      // 最终更新，确保所有内容都已渲染
      messageElement.innerHTML = marked.parse(content);
      addTimeToMessage(messageElement);
      forceScrollToBottom();
      return content;
    } catch (error) {
      console.error('API流式调用错误:', error);
      throw error;
    }
  };
  
  // 自动调整输入框高度
  if (chatInput) {
    chatInput.addEventListener('input', function() {
      // 不再需要根据输入内容调整高度
      // 输入框高度保持固定
    });
  }
  
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
  
  // 监听消息容器的变化，确保滚动到底部
  const observer = new MutationObserver(function(mutations) {
    // 检查是否真的有内容变化
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || 
          (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE)) {
        // 滚动到底部
        forceScrollToBottom();
        return;
      }
    }
  });
  
  if (chatMessages) {
    observer.observe(chatMessages, { 
      childList: true, 
      subtree: true,
      characterData: true 
    });
  }
}); 