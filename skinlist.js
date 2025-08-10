const skinList = document.getElementById("skin-list");
skins.forEach((skin) => {
  const rgb = skin.color;
  const textColor = `rgb(${rgb})`;
  const borderColor = `rgba(${rgb}, 0.5)`;
  
  const labelHTML = skin.label ?
    `<span class="label" style="background-color: ${textColor}">${skin.label}</span>` :
    "";
  const miniImgHTML = skin.miniImg ?
    `<img src="${skin.miniImg}" class="mod-mini" style="border-color: ${borderColor}" />` :
    "";
  const championNoteHTML = skin.champion && skin.miniImg ?
    `<div class="mod-champion-note">${skin.champion}</div>` :
    "";
  const titleHTML = skin.name ?
    `<div class="mod-title" style="background: linear-gradient(to bottom, #fff, ${textColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">${skin.name}</div>` :
    "";
  const descHTML = skin.desc ? `<div class="mod-desc">${skin.desc}</div>` : "";
  const downloadBtnHTML = skin.IOS && skin.Android ?
    `<div class="download-container"><div class="download-btn-main" style="background: ${textColor};color: black;" onclick="toggleDownloadOptions(this, '${skin.Android}', '${skin.IOS}', '${textColor}')">Tải xuống</div></div>` :
    "";
  
  const cardHTML = `
    <div class="mod-card" style="border-color: ${borderColor};color: ${textColor}" onclick="changeBg('${skin.bgImg}')">
      ${labelHTML}
      <img src="${skin.bgImg}" class="bg" />
      <div class="mod-info">
        ${miniImgHTML}
        <div class="mod-texts" style="color: ${textColor}">
          ${championNoteHTML}
          ${titleHTML}
          ${descHTML}
        </div>
      </div>
      ${downloadBtnHTML}
    </div>
  `;
  skinList.insertAdjacentHTML("beforeend", cardHTML);
});
document.querySelectorAll('.mod-card').forEach(function(card) {
  card.addEventListener('click', function() {

    if (document.body.classList.contains('no-animation')) return;
    
    const isExpanded = card.classList.contains('expand');
    if (isExpanded) return;
    
    document.querySelectorAll('.mod-card.expand').forEach(function(c) {
      collapseCard(c);
      c.classList.remove('expand');
    });
    
    expandCard(card);
    card.classList.add('expand');
  });
});function expandCard(card) {
  const startHeight = card.offsetHeight;
  card.style.height = startHeight + 'px';
  card.classList.add('expand');
  card.offsetHeight;
  const targetHeight = card.scrollHeight;
  card.style.height = targetHeight + 'px';
  card.addEventListener('transitionend', function handler() {
    card.style.height = 'auto';
    card.removeEventListener('transitionend', handler);
  });
}
function collapseCard(card) {
  const startHeight = card.scrollHeight;
  card.style.height = startHeight + 'px';
  card.offsetHeight;
  card.style.height = '60px';
}
    function toggleDownloadOptions(button, androidLink, iosLink, color) {
      const isExpanded = button.dataset.expanded === 'true';
      button.style.transition = 'opacity 0.3s ease';
      button.style.opacity = '0';
      setTimeout(() => {
        if (isExpanded) {
          button.innerHTML = 'Tải xuống';
          button.dataset.expanded = 'false';
        } else {
          button.innerHTML = `<a href="${androidLink}" target="_blank" style="color:#000;text-decoration:none;">Android</a><span style="margin: 0 5px;">|</span><a href="${iosLink}" target="_blank" style="color:#000;text-decoration:none;">iOS</a>`;
          button.dataset.expanded = 'true';
        }
        requestAnimationFrame(() => {
          button.style.opacity = '1';
        });
      }, 300);
      document.querySelectorAll('.download-btn-main').forEach(btn => {
        if (btn !== button) {
          btn.innerHTML = 'Tải xuống';
          btn.dataset.expanded = 'false';
          btn.style.opacity = '1';
        }
      });
    }
    document.addEventListener('click', (e) => {
      const isInside = e.target.closest('.download-container');
      if (!isInside) {
        document.querySelectorAll('.download-btn-main').forEach(btn => {
          btn.innerHTML = 'Tải xuống';
          btn.dataset.expanded = 'false';
          btn.style.opacity = '1';
        });
      }
    });
    
    