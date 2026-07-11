/* donate.js — popup donate. Style border đã chuyển sang components.css.
   Dùng #donate-item (thay cho .menu-item:nth-child(1) dễ vỡ khi đổi thứ tự). */
const donateItem  = document.getElementById('donate-item');
const donatePopup = document.getElementById('donate-popup');

if (donateItem && donatePopup) {
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
}
