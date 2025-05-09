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
}); 