const openServer = document.getElementById('open-server-list');
const menuList = openServer.querySelector('.menu3-list');
openServer.addEventListener('click', function(e) {
  e.stopPropagation();
  menuList.classList.toggle('show');
});
menuList.addEventListener('click', function(e) {
  e.stopPropagation();
});
document.addEventListener('click', function(e) {
  menuList.classList.remove('show');
});
  document.querySelectorAll('.menu3-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.currentTarget === item) {
        const link = item.getAttribute('data-link');
        if (link) window.open(link, '_blank');
      }
    });
  });