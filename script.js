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

  
  const musicPlayer = new Audio();
  musicPlayer.loop = false;

  const musicData = [
    { src: 'sound/fifai.mp3', name: 'Fifai', img: 'img/fifai.png' },
    { src: 'sound/conan.mp3', name: 'Conan', img: 'img/conan_mini.png' },
    { src: 'sound/kaito.mp3', name: 'Kaito Kid', img: 'img/kaito_mini.png' },
    { src: 'sound/robin.mp3', name: 'Welcome to my World - Robin', img: 'img/robin.png' },
    { src: 'sound/ndcm.mp3', name: 'Nắng dưới chân mây', img: 'img/ndcm.png' },
    { src: 'sound/13314.mp3', name: 'Valhein Thứ Nguyên Vệ Thần', img: 'img/13314head.jpg' },
  ];

  
  let musicEnabled = localStorage.getItem('musicEnabled');
  if (musicEnabled === null) {
    musicEnabled = 'true';
    localStorage.setItem('musicEnabled', 'true');
  }
  const isMusicEnabled = musicEnabled === 'true';

  
  let currentMusic = localStorage.getItem('currentMusic');
  if (!currentMusic || !musicData.some(m => m.src === currentMusic)) {
    currentMusic = musicData[0].src;
    localStorage.setItem('currentMusic', currentMusic);
  }

  musicPlayer.src = currentMusic;

  const toggleMusic = document.getElementById('toggle-music');
  toggleMusic.checked = isMusicEnabled;

  if (isMusicEnabled) {
    musicPlayer.play().catch(() => {
      console.log('Autoplay bị chặn, chờ user tương tác.');
    });
  }

  toggleMusic.addEventListener('change', function() {
    if (this.checked) {
      localStorage.setItem('musicEnabled', 'true');
      musicPlayer.play().catch(() => {
        console.log('Autoplay bị chặn');
      });
    } else {
      localStorage.setItem('musicEnabled', 'false');
      musicPlayer.pause();
    }
  });

  function setMusic(src) {
    currentMusic = src;
    musicPlayer.src = currentMusic;
    localStorage.setItem('currentMusic', currentMusic);
    if (toggleMusic.checked) {
      musicPlayer.play().catch(() => {});
    }
  }

 
  const popup = document.getElementById("welcome-popup");
  const closeBtn = document.getElementById("close-popup");
  let canClose = false;

  setTimeout(() => {
    popup.style.display = "flex";
    requestAnimationFrame(() => {
      popup.classList.add("show");
      popup.style.opacity = "1";
    });

    let countdown = 0;
    closeBtn.disabled = true;
    closeBtn.style.opacity = "0.5";
    closeBtn.style.pointerEvents = "none";
    closeBtn.style.cursor = "not-allowed";
    //closeBtn.textContent = `Có thể đóng sau ${countdown}s`;

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        closeBtn.textContent = `Có thể đóng sau ${countdown}s`;
      } else {
        clearInterval(countdownInterval);
        canClose = true;
        closeBtn.disabled = false;
        closeBtn.textContent = "";
        closeBtn.style.opacity = "1";
        closeBtn.style.pointerEvents = "auto";
        closeBtn.style.cursor = "pointer";
      }
    }, 1000);
  }, 100);

  function closePopup() {
    if (!canClose) return;
    popup.classList.remove("show");
    popup.style.opacity = "0";

    if (toggleMusic.checked) {
      musicPlayer.play().catch(() => {
        console.log('Autoplay bị chặn');
      });
    } else {
      musicPlayer.pause();
    }
  }

  popup.addEventListener("transitionend", function(e) {
    if (e.propertyName === "opacity" && !popup.classList.contains("show")) {
      popup.style.display = "none";
    }
  });

  closeBtn.addEventListener("click", closePopup);
  popup.addEventListener("click", function(e) {
    if (e.target === popup && canClose) {
      closePopup();
    }
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

  
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", e => {
      const link = item.querySelector("a");
      if (link && !e.target.closest("a")) {
        window.open(link.href, '_blank');
      }
    });
  });
});