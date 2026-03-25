document.addEventListener("DOMContentLoaded", function() {
  
  const menuButton = document.getElementById('menu-button');
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  
  menuButton.addEventListener('click', () => {
    sideMenu.classList.add('show');
    overlay.classList.add('show');
  });
  
  overlay.addEventListener('click', () => {
    sideMenu.classList.remove('show');
    overlay.classList.remove('show');
  });
  

  const chonMod = document.getElementById("chonmod");
  const skinList = document.getElementById("skin-list");
  let isOpen = false;
  let isAnimating = false; 
  
  function openSkinList() {
    if (isAnimating) return;
    isAnimating = true;
    
    skinList.style.height = skinList.scrollHeight + "px";
    skinList.classList.remove("collapsed");
    skinList.classList.add("expanded");
    
    skinList.addEventListener("transitionend", function handler() {
      skinList.style.height = "auto";
      isAnimating = false;
      skinList.removeEventListener("transitionend", handler);
    });
    isOpen = true;
  }
  
  function closeSkinList() {
    if (isAnimating) return;
    isAnimating = true;
    
    skinList.style.height = skinList.scrollHeight + "px";
    requestAnimationFrame(() => {
      skinList.style.height = "0px";
      skinList.classList.add("collapsed");
      skinList.classList.remove("expanded");
    });
    
    skinList.addEventListener("transitionend", function handler() {
      isAnimating = false;
      skinList.removeEventListener("transitionend", handler);
    });
    isOpen = false;
  }
  
  chonMod.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (isOpen) {
      closeSkinList();
    } else {
      openSkinList();
    }
  });
  
  
  document.addEventListener("click", function(event) {
    if (!isOpen || isAnimating) return; 
    const target = event.target;
    const isOutsideSkinList = !skinList.contains(target);
    const isInsideModCard = target.closest('.modcard') !== null;
    const isInsideSideMenu = target.closest('#side-menu') !== null;
    const isInsideHeader = target.closest('header') !== null;
    const isInsideOverlay = target.closest('#overlay') !== null;
    
    if (isOutsideSkinList && !isInsideModCard && !isInsideSideMenu && !isInsideHeader && !isInsideOverlay) {
      closeSkinList();
    }
  });
  
  skinList.addEventListener("click", function(event) {
    event.stopPropagation();
  });
  
  

  window.addEventListener('wheel', function(e) { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  window.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) e.preventDefault();
  });
  

  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", e => {
      const link = item.querySelector("a");
      if (link && !e.target.closest("a")) window.open(link.href, '_blank');
    });
  });
  
});