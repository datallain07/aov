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
      setTimeout(() => donatePopup.style.display = 'none', 300);
    }
  });