function getRGBColor(time) {
    const r = Math.floor(127 * Math.sin(0.03 * time + 0) + 128);
    const g = Math.floor(127 * Math.sin(0.03 * time + 2) + 128);
    const b = Math.floor(127 * Math.sin(0.03 * time + 4) + 128);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function startRGBGlow(element) {
    let time = 0;
    element.classList.add('rgb-glow');
    const interval = setInterval(() => {
      const color = getRGBColor(time);
      element.style.setProperty('--rgb-color', color);
      time++;
    }, 50);
    return () => {
      clearInterval(interval);
      element.classList.remove('rgb-glow');
    };
  }
  
const items = document.querySelectorAll('.menu-item');
  let stopGlow = null;
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (stopGlow) stopGlow();
      stopGlow = startRGBGlow(item);
    });
  });