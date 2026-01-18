// Force light mode - remove dark class immediately
function forceLightMode() {
  const html = document.documentElement;
  
  // Remove dark class immediately
  html.classList.remove('dark');
  
  // Watch for any attempts to add dark class
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (html.classList.contains('dark')) {
          html.classList.remove('dark');
          console.log('Dark mode was blocked - forcing light mode');
        }
      }
    });
  });
  
  observer.observe(html, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // Force light background
  document.body.style.background = 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)';
  document.body.style.color = '#111827';
  
  console.log('Light mode enforced');
}

// Run immediately
forceLightMode();

// Also run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', forceLightMode);
} else {
  forceLightMode();
}

export default forceLightMode;
