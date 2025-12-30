function getAverageColor(image) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const w = canvas.width = 10;
      const h = canvas.height = 10;

      ctx.drawImage(img, 0, 0, w, h);

      const data = ctx.getImageData(0, 0, w, h).data;

      let r = 0, g = 0, b = 0;
      const total = w * h;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.round(r / total);
      g = Math.round(g / total);
      b = Math.round(b / total);

      resolve({ r, g, b });
    };

    img.onerror = () => resolve({ r: 255, g: 255, b: 255 });
  });
}




const headGrid = document.getElementById('head-grid');
const searchInput = document.getElementById('search');
let showSplashId = localStorage.getItem('showSplashId') === 'true';
let showSplashLabel = localStorage.getItem('showSplashLabel') === 'true';
const ID_RANGES = [
  { start: 105, end: 206 },
  { start: 501, end: 650 }
];
let heroSkinShop = [];

function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  const messageEl = document.getElementById('toast-message');
  if (!toast || !messageEl) return;
  
  messageEl.textContent = message;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
const imageCacheMemory = {};

function checkImageExists(url) {
  const cacheKey = 'image_exists_' + url;
  
  if (cacheKey in imageCacheMemory) return Promise.resolve(imageCacheMemory[cacheKey]);
  
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const data = JSON.parse(cached);
    const maxAge = 1000 * 60 * 60 * 24 * 365;
    if (Date.now() - data.timestamp < maxAge) {
      imageCacheMemory[cacheKey] = data.exists;
      return Promise.resolve(data.exists);
    }
  }
  
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      localStorage.setItem(cacheKey, JSON.stringify({ exists: true, timestamp: Date.now() }));
      imageCacheMemory[cacheKey] = true;
      resolve(true);
    };
    img.onerror = () => {
      localStorage.setItem(cacheKey, JSON.stringify({ exists: false, timestamp: Date.now() }));
      imageCacheMemory[cacheKey] = false;
      resolve(false);
    };
    img.src = url;
  });
}

async function showHeroImages(heroId, splashDiv, card) {

  if (card.dataset.loading === "true") return;
  card.dataset.loading = "true";

  const isActive = card.classList.contains('active');

  
  document.querySelectorAll('.dat2-item').forEach(el => {
    el.classList.remove('active');
    const otherSplash = el.querySelector('.splash-container');
    if (otherSplash) otherSplash.innerHTML = '';
  });

  
  if (isActive) {
    splashDiv.innerHTML = '';
    card.classList.remove('active');
    card.dataset.loading = "false";  
    return;
  }

  card.classList.add('active');
  splashDiv.innerHTML = '<small style="color: gray;">Đang tải, vui lòng đợi giây lát...</small>';
  
  let found = false;

  for (let i = 0; i < 100; i++) {
    const suffix = String(i).padStart(2, '0');
    const fullId = `${heroId}${suffix}`;
    const bigUrl = `https://dl.ops.kgtw.garenanow.com/CHT/HeroTrainingLoadingNew_B36/${fullId}.jpg`;
    const exists = await checkImageExists(bigUrl);

    if (!exists) continue;
    if (!found) splashDiv.innerHTML = '';
    found = true;

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.marginTop = '8px';

    const img = document.createElement('img');
    img.src = bigUrl;
    img.alt = fullId;
    img.style.width = '100%';
    img.style.borderRadius = '12px';

    const idTag = document.createElement('div');
    const idName = (typeof skinData !== 'undefined' && skinData[fullId]) ? `${fullId}: ${skinData[fullId]}` : fullId;
    idTag.textContent = idName;
    idTag.style.position = 'absolute';
    idTag.style.top = '8px';
    idTag.style.left = '8px';
    idTag.style.color = 'white';
    idTag.style.padding = '2px 6px';
    idTag.style.fontSize = '12px';
    idTag.style.borderRadius = '4px';
    idTag.style.backgroundColor = 'rgba(0,0,0,0.6)';
    idTag.style.pointerEvents = 'none';
    idTag.style.display = showSplashId ? 'block' : 'none';
    idTag.classList.add('splash-id');


    let labelFile = `${fullId}.png`;
    const skinInfo = heroSkinShop.find(s => String(s.ID) === fullId);
    if (skinInfo && skinInfo.LimitLabelPicUrl) labelFile = skinInfo.LimitLabelPicUrl;
    const labelUrl = `https://dl.ops.kgvn.garenanow.com/hok/SkinLabel/${labelFile}`;
    const labelExists = await checkImageExists(labelUrl);

    if (labelExists) {
        const labelImg = document.createElement('img');
        labelImg.src = labelUrl;
        labelImg.style.position = 'absolute';
        labelImg.style.top = '8px';
        labelImg.style.right = '8px';
        labelImg.style.width = '48px';
        labelImg.style.height = 'auto';
        labelImg.style.pointerEvents = 'auto';
        labelImg.style.objectFit = 'contain';
        labelImg.style.backgroundColor = 'transparent';
        labelImg.style.border = 'none';
        labelImg.style.boxShadow = 'none';
        labelImg.style.outline = 'none';
        labelImg.style.imageRendering = 'auto';
        labelImg.style.clipPath = 'inset(1px)';
        labelImg.style.transform = 'scale(1.01)';
        labelImg.style.transformOrigin = 'center';
        labelImg.style.display = showSplashLabel ? 'block' : 'none';
        labelImg.classList.add('splash-label');
        wrapper.appendChild(labelImg);
    }

    wrapper.appendChild(img);
wrapper.appendChild(idTag);


const headId = convertSplashIdToHeadId(fullId);
const headUrl = `https://dl.ops.kgtw.garenanow.com/CHT/HeroHeadPath/30${headId}head.jpg`;

const headExists = await checkImageExists(headUrl);

if (headExists) {

  
  const avgColor = await getAverageColor(bigUrl);

  
  const borderColor = `rgb(
    ${Math.min(avgColor.r + 40, 255)},
    ${Math.min(avgColor.g + 40, 255)},
    ${Math.min(avgColor.b + 40, 255)}
  )`;

  const headImg = document.createElement('img');
  headImg.src = headUrl;
  headImg.style.position = 'absolute';
  headImg.style.bottom = '8px';
  headImg.style.left = '5px';
  headImg.style.width = '48px';
  headImg.style.height = '48px';
  headImg.style.borderRadius = '8px';
  headImg.style.objectFit = 'cover';
  headImg.style.pointerEvents = 'auto';
  headImg.style.border = `1px solid ${borderColor}`;
  headImg.style.background = "transparent";
  headImg.style.padding = "0";

  wrapper.appendChild(headImg);
}

splashDiv.appendChild(wrapper);
    splashDiv.appendChild(wrapper);
  }

  if (!found) {
    splashDiv.innerHTML = '<small style="color: red;">Không tìm thấy splash art.</small>';
  }

  card.dataset.loading = "false";
}

async function loadHeroHeads() {
  const allIDs = [];
  for (const range of ID_RANGES) {
    for (let id = range.start; id <= range.end; id++) {
      allIDs.push(id);
    }
  }

  allIDs.sort((a, b) => a - b);

  for (const heroId of allIDs) {
    const idStr = String(heroId).padStart(3, '0');
    const headUrl = `https://dl.ops.kgtw.garenanow.com/CHT/HeroHeadPath/30${idStr}0head.jpg`;
    const exists = await checkImageExists(headUrl);
    if (exists) {
      const card = document.createElement('div');
      card.className = 'dat2-item';
      card.dataset.name = (heroList[heroId] || "").toLowerCase();

      const header = document.createElement('div');
      header.className = 'dat2-header';

      const img = document.createElement('img');
      img.src = headUrl;
      img.className = 'thumb';
      img.alt = `${heroId}`;

      const textDiv = document.createElement('div');
      textDiv.className = 'text';
      const nameEl = document.createElement('strong');
      nameEl.textContent = heroList[heroId] || `ID ${heroId}`;
      const small = document.createElement('small');
      small.textContent = 'Click để xem splash art';
      textDiv.appendChild(nameEl);
      textDiv.appendChild(small);
      header.appendChild(img);
      header.appendChild(textDiv);

      const splashContainer = document.createElement('div');
      splashContainer.className = 'splash-container';

      card.appendChild(header);
      card.appendChild(splashContainer);

      header.addEventListener('click', (e) => {
        e.stopPropagation();
        showHeroImages(heroId, splashContainer, card);
      });

      headGrid.appendChild(card);
    }
  }
}

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll('.dat2-item');
  cards.forEach(card => {
    const name = (card.dataset.name || "").toLowerCase();
    let matchedId = '';
    for (const [id, heroName] of Object.entries(heroList)) {
      if (heroName.toLowerCase() === name) {
        matchedId = id;
        break;
      }
    }
    const match = name.includes(keyword) || matchedId.includes(keyword);
    card.style.display = match ? 'flex' : 'none';
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const showIdToggle = document.getElementById("toggle-show-id");
  const showLabelToggle = document.getElementById("toggle-show-label");
  if (showIdToggle) {
    showIdToggle.checked = showSplashId;
    showIdToggle.addEventListener("change", () => {
      showSplashId = showIdToggle.checked;
      localStorage.setItem('showSplashId', showSplashId);
      updateHeroNames(showSplashId);
      updateSplashIdVisibility(showSplashId);
    });
  }
  if (showLabelToggle) {
    showLabelToggle.checked = showSplashLabel;
    showLabelToggle.addEventListener("change", () => {
      showSplashLabel = showLabelToggle.checked;
      localStorage.setItem('showSplashLabel', showSplashLabel);
      updateSplashLabelVisibility(showSplashLabel);
    });
  }
});

function updateHeroNames(showId) {
  document.querySelectorAll(".dat2-item").forEach(card => {
    const img = card.querySelector("img.thumb");
    const nameEl = card.querySelector("strong");
    if (!img || !nameEl) return;
    const heroId = parseInt(img.alt);
    const name = heroList[heroId] || "null";
    nameEl.textContent = showId ? `${heroId}: ${name}` : name;
  });
}

function updateSplashIdVisibility(showId) {
  document.querySelectorAll(".splash-id").forEach(idTag => {
    idTag.style.display = showId ? 'block' : 'none';
  });
}

function updateSplashLabelVisibility(showLabel) {
  document.querySelectorAll(".splash-label").forEach(label => {
    label.style.display = showLabel ? 'block' : 'none';
  });
}

const splashButton = document.getElementById('open-splash');
const splashContainer = document.getElementById('splash-container');

splashButton.addEventListener('click', function(event) {
  event.stopPropagation();
  if (splashContainer.classList.contains('hidden')) {
    splashContainer.classList.remove('hidden');
    splashContainer.style.height = '0px';
    requestAnimationFrame(() => {
      const fullHeight = splashContainer.scrollHeight + "px";
      splashContainer.style.transition = "height 0.3s ease";
      splashContainer.style.height = fullHeight;
      splashContainer.addEventListener("transitionend", function handleTransitionEnd() {
        splashContainer.style.height = "auto";
        splashContainer.removeEventListener("transitionend", handleTransitionEnd);
      });
    });
  } else {
    splashContainer.style.height = splashContainer.scrollHeight + "px";
    requestAnimationFrame(() => {
      splashContainer.style.transition = "height 0.3s ease";
      splashContainer.style.height = "0px";
    });
    setTimeout(() => {
      splashContainer.classList.add('hidden');
    }, 300);
  }
});

splashContainer.addEventListener('click', function(event) {
  event.stopPropagation();
});

document.addEventListener('click', function() {
  if (!splashContainer.classList.contains('hidden')) {
    splashContainer.style.height = splashContainer.scrollHeight + "px";
    requestAnimationFrame(() => {
      splashContainer.style.transition = "height 0.3s ease";
      splashContainer.style.height = "0px";
    });
    setTimeout(() => {
      splashContainer.classList.add('hidden');
    }, 300);
  }
});



function convertSplashIdToHeadId(fullId) {
  const base = fullId.slice(0, -2);   
  const tail = parseInt(fullId.slice(-2)); 
  if (tail < 10) return base + tail;
  return fullId;
}



heroSkinShop = window.heroSkinShop || [];
(async () => {
  await loadHeroHeads();
  updateHeroNames(showSplashId);
  updateSplashIdVisibility(showSplashId);
  updateSplashLabelVisibility(showSplashLabel);
})();
