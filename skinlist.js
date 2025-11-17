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
             onclick="openDownloadPopup2(
              '${skin.bgImg}',
              '${skin.miniImg}',
              '${skin.champion}',
              '${skin.name}',
              '${skin.desc}',
              '${skin.label}',   
              '${skin.Android}',
              '${skin.IOS}',
              'rgba(${skin.color}, 0.5)'
             )">
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

let cardLocked = false;

document.querySelectorAll(".mod-card").forEach(function(card) {
  card.addEventListener("click", function() {
    

    if (cardLocked) return; 
    cardLocked = true;
    setTimeout(() => cardLocked = false, 500);
    
    
    const isExpanded = card.classList.contains("expand");

    if (isExpanded) {
      collapseCard(card);
      card.classList.remove("expand");
      return;
    }

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

function openDownloadPopup2(bgImg, miniImg, champion, name, desc, label, androidLink, iosLink, borderColor) {
  const popup = document.getElementById("dlPopupX");
  const box = popup.querySelector(".dl-box");
  
  box.style.border = `2px solid ${borderColor}`;
  box.style.borderRadius = "12px";
  
  document.getElementById("dlBgX").src = bgImg;
  document.getElementById("dlMiniX").src = miniImg;
  document.getElementById("dlMiniX").style.borderColor = borderColor;
  
  const oldSep = box.querySelector(".bg-separator");
  if (oldSep) oldSep.remove();
  
  const separator = document.createElement("div");
  separator.className = "bg-separator";
  separator.style.height = "2px";
  separator.style.width = "100%";
  separator.style.background = borderColor;
  separator.style.margin = "0px 0";
  
  const previewArea = box.querySelector(".preview-area");
  previewArea.insertAdjacentElement("afterend", separator);
  
  const rgb = borderColor.replace("rgba(", "").replace(", 0.5)", "");
  const textColor = `rgb(${rgb})`;
  

  const champElem = document.getElementById("dlChampX");
  champElem.innerText = champion || "";
  champElem.style.color = textColor;
  
  
  const nameElem = document.getElementById("dlNameX");
  nameElem.innerText = name || "";
  nameElem.style.background = `linear-gradient(to bottom, #fff, ${textColor})`;
  nameElem.style.webkitBackgroundClip = "text";
  nameElem.style.webkitTextFillColor = "transparent";
  nameElem.style.display = "inline-block";
  

  document.getElementById("dlDescX").innerText = desc || "";
  

  const labelElem = document.getElementById("dlLabelX");
  if (label) {
    labelElem.innerText = label;
    labelElem.style.backgroundColor = textColor;
    labelElem.style.color = "black";
    labelElem.style.padding = "4px 8px";
    labelElem.style.borderRadius = "6px";
    labelElem.style.display = "inline-block";
  } else {
    labelElem.innerText = "";
    labelElem.style.display = "none";
  }
  
  
  const androidBtn = document.getElementById("dlAndroidX");
  const iosBtn = document.getElementById("dlIOSX");
  
  const gradientBg = `linear-gradient(to right, #fff, ${textColor})`;
  [androidBtn, iosBtn].forEach(btn => {
    btn.style.background = gradientBg;
    btn.style.color = "black";
    btn.style.borderRadius = "6px";
    btn.style.padding = "8px 16px";
    btn.style.textDecoration = "none";
    btn.style.display = "inline-block";
    btn.style.textAlign = "center";
    btn.style.width = "auto";
  });
  
  popup.classList.add("show");
  
  const maxWidth = Math.max(androidBtn.offsetWidth, iosBtn.offsetWidth);
  androidBtn.style.width = maxWidth + "px";
  iosBtn.style.width = maxWidth + "px";
  
  androidBtn.href = androidLink;
  iosBtn.href = iosLink;
  
  popup.classList.add("show");
}

document.getElementById("dlPopupX").addEventListener("click", function(e) {
  if (e.target === this) {
    document.getElementById("dlPopupX").classList.remove("show");
    e.stopPropagation();
  }
});
document.getElementById("dlAndroidX").addEventListener("click", () => {
  document.getElementById("dlPopupX").classList.remove("show");
});
document.getElementById("dlIOSX").addEventListener("click", () => {
  document.getElementById("dlPopupX").classList.remove("show");
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