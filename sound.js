const musicPlayer = new Audio();
  musicPlayer.loop = false;

  const musicData = [
    { src: 'sound/fifai.mp3', name: 'Fifai', img: 'img/fifai.png' },
    { src: 'sound/conan.mp3', name: 'Conan', img: 'img/conan_mini.png' },
    { src: 'sound/kaito.mp3', name: 'Kaito Kid', img: 'img/kaito_mini.png' },
    { src: 'sound/robin.mp3', name: 'Welcome to my World - Robin', img: 'img/robin.png' },
    { src: 'sound/ndcm.mp3', name: 'Nắng dưới chân mây', img: 'img/ndcm.png' },
    { src: 'sound/13314.mp3', name: 'Valhein Thứ Nguyên Vệ Thần', img: 'img/13314head.jpg' },
    { src: 'sound/emtlg.mp3', name: 'Em muốn ta là gì Remix', img: 'img/emtlg.png' },
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
    requestAnimationFrame(() => musicPopup.classList.add('show'));
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
  
  changeMusicBtn.addEventListener('click', openMusicPopup);
  
  musicPopup.addEventListener('click', (event) => {
    if (event.target === musicPopup) closeMusicPopup();
  });
  
  musicPlayer.addEventListener('ended', () => {
    musicPlayer.currentTime = 0;
    musicPlayer.play().catch(() => {});
  });