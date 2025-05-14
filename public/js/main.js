document.addEventListener('DOMContentLoaded', function() {
  // 下拉菜单切换
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = this.parentElement;
      const dropdownMenu = parent.querySelector('.dropdown-menu');
      
      // 关闭其他打开的菜单
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        if (menu !== dropdownMenu) {
          menu.classList.remove('show');
        }
      });
      
      // 切换当前菜单
      dropdownMenu.classList.toggle('show');
    });
  });
  
  // 如果页面上有源代码显示，添加语法高亮
  const sourceCode = document.querySelector('.source-code pre code');
  if (sourceCode) {
    // 这里可以添加语法高亮库，如Prism.js或Highlight.js
    // 简单起见，这里不添加外部库
  }
  
  // 添加首页卡片鼠标悬停效果
  const featureCards = document.querySelectorAll('.feature-list li');
  if (featureCards.length > 0) {
    featureCards.forEach(card => {
      // 随机角度，使卡片初始位置略有不同
      const randomRotate = (Math.random() - 0.5) * 1.5;
      card.style.transform = `rotate(${randomRotate}deg)`;
      
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.03) rotate(0deg)';
        this.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = `rotate(${randomRotate}deg)`;
        this.style.zIndex = '1';
      });
    });
  }
  
  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // 警告框脉动效果
  const warningBox = document.querySelector('.warning');
  if (warningBox) {
    setTimeout(() => {
      warningBox.classList.add('pulse');
      
      setTimeout(() => {
        warningBox.classList.remove('pulse');
      }, 1000);
    }, 2000);
  }
}); 