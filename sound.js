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