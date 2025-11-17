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

  chonMod.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (isOpen) return;
    skinList.style.height = skinList.scrollHeight + "px";
    skinList.classList.remove("collapsed");
    skinList.classList.add("expanded");
    skinList.addEventListener("transitionend", function handler() {
      skinList.style.height = "auto";
      skinList.removeEventListener("transitionend", handler);
    });
    isOpen = true;
  });
  
  document.addEventListener("click", function(event) {
    const target = event.target;
    const isOutsideSkinList = !skinList.contains(target);
    const isInsideSideMenu = target.closest('#side-menu') !== null;
    const isInsideHeader = target.closest('header') !== null;
    const isInsideOverlay = target.closest('#overlay') !== null;

    if (
      isOpen &&
      isOutsideSkinList &&
      !isInsideSideMenu &&
      !isInsideHeader &&
      !isInsideOverlay
    ) {
      skinList.style.height = skinList.scrollHeight + "px";
      requestAnimationFrame(() => {
        skinList.style.height = "0px";
        skinList.classList.add("collapsed");
        skinList.classList.remove("expanded");
      });
      isOpen = false;
    }
  });

  skinList.addEventListener("click", function(event) {
    event.stopPropagation();
  });
 


  const donateItem = document.querySelector('.menu-item:nth-child(1)');
  const donatePopup = document.getElementById('donate-popup');

  donateItem.addEventListener('click', () => {
    donatePopup.style.display = 'flex';
    setTimeout(() => {
      donatePopup.classList.add('show');
      donatePopup.classList.remove('hide');
    }, 10);
  });

  donatePopup.addEventListener('click', (e) => {
    if (e.target === donatePopup) {
      donatePopup.classList.add('hide');
      donatePopup.classList.remove('show');
      setTimeout(() => {
        donatePopup.style.display = 'none';
      }, 300);
    }
  });

  
  const musicPopup = document.getElementById('musicPopup');
  const musicList = document.getElementById('musicList');
  const changeMusicBtn = document.getElementById('changeMusicBtn');

  function openMusicPopup() {
    musicList.innerHTML = '';
    musicData.forEach(item => {
      const li = document.createElement('li');
      li.style.cursor = 'pointer';
      li.style.padding = '8px 0';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '10px';

      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.name;
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '4px';

      const text = document.createElement('span');
      text.textContent = item.name;

      if (item.src === currentMusic) {
        const selectedSpan = document.createElement('span');
        selectedSpan.textContent = 'Đang chọn';
        selectedSpan.style.color = 'green';
        selectedSpan.style.display = 'block';
        text.appendChild(selectedSpan);
        li.style.fontWeight = 'bold';
      }

      li.appendChild(img);
      li.appendChild(text);

      li.addEventListener('click', () => {
        setMusic(item.src);
        closeMusicPopup();
      });

      musicList.appendChild(li);
    });

    musicPopup.style.display = 'flex';
    requestAnimationFrame(() => {
      musicPopup.classList.add('show');
    });
  }

  function closeMusicPopup() {
    musicPopup.classList.remove('show');
    musicPopup.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'opacity' && !musicPopup.classList.contains('show')) {
        musicPopup.style.display = 'none';
        musicPopup.removeEventListener('transitionend', handler);
      }
    });
  }

  changeMusicBtn.addEventListener('click', () => {
    openMusicPopup();
  });

  musicPopup.addEventListener('click', (event) => {
    if (event.target === musicPopup) {
      closeMusicPopup();
    }
  });

  musicPlayer.addEventListener('ended', () => {
    musicPlayer.currentTime = 0;
    musicPlayer.play().catch(() => {});
  });

  
  window.addEventListener('wheel', function(e) {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });

  window.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
      e.preventDefault();
    }
  });


  const items = document.querySelectorAll('.menu-item');
  let stopGlow = null;
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (stopGlow) stopGlow();
      stopGlow = startRGBGlow(item);
    });
  });

  
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", e => {
      const link = item.querySelector("a");
      if (link && !e.target.closest("a")) {
        window.open(link.href, '_blank');
      }
    });
  });
});
