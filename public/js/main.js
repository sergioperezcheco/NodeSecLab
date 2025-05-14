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
  
  // 首页卡片高级特效
  const featureCards = document.querySelectorAll('.feature-list li');
  if (featureCards.length > 0) {
    // 设置初始卡片效果
    featureCards.forEach((card, index) => {
      // 交错的入场动画
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 * index);
      
      // 添加悬停特效
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.03)';
        this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
        this.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
        this.style.zIndex = '1';
      });
    });
    
    // 3D倾斜效果
    const container = document.querySelector('.feature-cards-container');
    if (container) {
      featureCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
          const { left, top, width, height } = this.getBoundingClientRect();
          const x = e.clientX - left;
          const y = e.clientY - top;
          
          const xRotation = ((y - height / 2) / 25) * -1;
          const yRotation = (x - width / 2) / 25;
          
          this.style.transform = `perspective(1000px) scale(1.03) rotateX(${xRotation}deg) rotateY(${yRotation}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseout', function() {
          this.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0) translateY(0)';
        });
      });
    }
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
  
  // 警告框动画效果
  const warningBox = document.querySelector('.warning');
  if (warningBox) {
    // 入场动画
    warningBox.style.opacity = '0';
    warningBox.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      warningBox.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      warningBox.style.opacity = '1';
      warningBox.style.transform = 'translateY(0)';
      
      // 添加轻微的悬浮效果
      setInterval(() => {
        warningBox.style.transform = 'translateY(-5px)';
        setTimeout(() => {
          warningBox.style.transform = 'translateY(0)';
        }, 1000);
      }, 3000);
    }, 800);
  }
  
  // 页面滚动时的视差效果
  const addParallaxEffect = () => {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // 添加标题视差效果
      const welcomeTitle = document.querySelector('.welcome h2');
      if (welcomeTitle) {
        welcomeTitle.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
      
      // 添加介绍文字视差效果
      const introText = document.querySelector('.intro-text');
      if (introText) {
        introText.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    });
  };
  
  // 启用视差效果
  addParallaxEffect();
}); 