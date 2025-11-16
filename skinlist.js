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
  
  const championNoteHTML =
    skin.champion && skin.miniImg ?
    `<div class="mod-champion-note">${skin.champion}</div>` :
    "";
  
  const titleHTML = skin.name ?
    `<div class="mod-title" style="background: linear-gradient(to bottom, #fff, ${textColor}); 
       -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
       ${skin.name}</div>` :
    "";
  
  const descHTML = skin.desc ? `<div class="mod-desc">${skin.desc}</div>` : "";
  

  const downloadBtnHTML =
  skin.IOS && skin.Android ?
  `
    <div class="download-container">
      <div class="download-btn-main" 
           style="background: ${textColor}; color: black;"
           onclick="openDownloadPopup2('${skin.popImg}', '${skin.Android}', '${skin.IOS}', 'rgba(${skin.color}, 0.5)')">
        Tải xuống
      </div>
    </div>` :
  "";
  
  const cardHTML = `
    <div class="mod-card" style="border-color: ${borderColor}; color: ${textColor}" onclick="changeBg('${skin.bgImg}')">
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



document.querySelectorAll(".mod-card").forEach(function(card) {
  card.addEventListener("click", function() {
    if (document.body.classList.contains("no-animation")) return;
    
    const isExpanded = card.classList.contains("expand");
    if (isExpanded) return;
    
    document.querySelectorAll(".mod-card.expand").forEach(function(c) {
      collapseCard(c);
      c.classList.remove("expand");
    });
    
    expandCard(card);
    card.classList.add("expand");
  });
});

function expandCard(card) {
  const startHeight = card.offsetHeight;
  card.style.height = startHeight + "px";
  card.classList.add("expand");
  card.offsetHeight;
  const targetHeight = card.scrollHeight;
  card.style.height = targetHeight + "px";
  
  card.addEventListener("transitionend", function handler() {
    card.style.height = "auto";
    card.removeEventListener("transitionend", handler);
  });
}

function collapseCard(card) {
  const startHeight = card.scrollHeight;
  card.style.height = startHeight + "px";
  card.offsetHeight;
  card.style.height = "60px";
}


function openDownloadPopup2(img, androidLink, iosLink, borderColor) {
  const popup = document.getElementById("dlPopupX");


  const dlImg = document.getElementById("dlImgX");
  dlImg.src = img;


  dlImg.style.border = `3px solid ${borderColor}`;
  dlImg.style.borderRadius = "8px"; // nếu muốn bo tròn

  document.getElementById("dlAndroidX").href = androidLink;
  document.getElementById("dlIOSX").href = iosLink;

  popup.classList.add("show");
}

document.getElementById("dlPopupX").addEventListener("click", function(e) {
  if (e.target === this) {
    this.classList.remove("show");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem("skinsList") || "[]");
  
  const currentList = skins.map((s) => `${s.champion}-${s.name}`);
  
  const newSkins = currentList.filter((s) => !storedData.includes(s));
  
  if (newSkins.length > 0) {
    showToast(`Có thêm ${newSkins.length} mod mới🎉`);
  }
  
  localStorage.setItem("skinsList", JSON.stringify(currentList));
});

document.getElementById("dlAndroidX").addEventListener("click", () => {
  document.getElementById("dlPopupX").classList.remove("show");
});
document.getElementById("dlIOSX").addEventListener("click", () => {
  document.getElementById("dlPopupX").classList.remove("show");
});