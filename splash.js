/* =========================================================================
   splash.js — Thư viện Splash Art (đã tối ưu)
   Thay đổi chính:
   • checkImageExists chạy SONG SONG có giới hạn (mapLimit) thay vì tuần tự
     từng ảnh -> mở thư viện / mở 1 tướng nhanh hơn nhiều.
   • Bỏ lỗi append trùng (ảnh trước đây bị thêm 2 lần).
   • Style ảnh chuyển sang class (components.css) thay vì set inline lặp lại.
   • Gộp 2 listener document-click trùng nhau thành 1.
   ========================================================================= */
/* Chạy tối đa `limit` tác vụ async cùng lúc, GIỮ NGUYÊN thứ tự kết quả. */
Object.keys(localStorage).filter(k=>k.startsWith('image_exists_')).forEach(k=>localStorage.removeItem(k))
async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function getAverageColor(image) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const w = canvas.width = 10, h = canvas.height = 10;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let r = 0, g = 0, b = 0;
      const total = w * h;
      for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
      resolve({ r: Math.round(r / total), g: Math.round(g / total), b: Math.round(b / total) });
    };
    img.onerror = () => resolve({ r: 255, g: 255, b: 255 });
  });
}

const headGrid = document.getElementById('head-grid');
const searchInput = document.getElementById('search');
let showSplashId = localStorage.getItem('showSplashId') === 'true';
let showSplashLabel = localStorage.getItem('showSplashLabel') === 'true';
const ID_RANGES = [{ start: 105, end: 206 }, { start: 501, end: 650 }];
let heroSkinShop = window.heroSkinShop || [];

function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  const messageEl = document.getElementById('toast-message');
  if (!toast || !messageEl) return;
  messageEl.textContent = message;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// Dọn cache cũ: bản trước lưu image_exists_* trong localStorage tới 1 năm,
// khiến skin mới thêm không hiện vì kết quả "không tồn tại" bị giữ lại.
try {
  Object.keys(localStorage)
    .filter(k => k.startsWith('image_exists_'))
    .forEach(k => localStorage.removeItem(k));
} catch (e) {}

// KHÔNG lưu cache vào localStorage nữa. Chỉ nhớ trong PHIÊN hiện tại để không
// kiểm tra trùng 1 URL nhiều lần; tải lại trang là kiểm tra mới hoàn toàn.
const imageCacheMemory = {};
function checkImageExists(url) {
  if (url in imageCacheMemory) return Promise.resolve(imageCacheMemory[url]);
  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => { imageCacheMemory[url] = true;  resolve(true); };
    img.onerror = () => { imageCacheMemory[url] = false; resolve(false); };
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
  splashDiv.innerHTML = '<small class="splash-loading">Đang tải, vui lòng đợi giây lát...</small>';

  // 1) Dò 100 khả năng id splash SONG SONG (nhanh), giữ thứ tự
  const suffixes = Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0'));
  const scanned = await mapLimit(suffixes, 12, async (suffix) => {
    const fullId = `${heroId}${suffix}`;
    const bigUrl = `https://dl.ops.kgtw.garenanow.com/CHT/HeroTrainingLoadingNew_B36/${fullId}.jpg`;
    return { fullId, bigUrl, exists: await checkImageExists(bigUrl) };
  });
  const existing = scanned.filter(s => s.exists);

  if (existing.length === 0) {
    splashDiv.innerHTML = '<small class="splash-error">Không tìm thấy splash art.</small>';
    card.dataset.loading = "false";
    return;
  }

  splashDiv.innerHTML = '';
  // 2) Dựng từng ảnh có thật (số lượng ít) — style bằng class
  for (const { fullId, bigUrl } of existing) {
    const wrapper = document.createElement('div');
    wrapper.className = 'splash-wrapper';

    const img = document.createElement('img');
    img.src = bigUrl;
    img.alt = fullId;
    img.loading = 'lazy';
    img.className = 'splash-big';

    const idTag = document.createElement('div');
    idTag.textContent = (typeof skinData !== 'undefined' && skinData[fullId])
      ? `${fullId}: ${skinData[fullId]}` : fullId;
    idTag.className = 'splash-id';
    idTag.style.display = showSplashId ? 'block' : 'none';

    // Label skin
    let labelFile = `${fullId}.png`;
    const skinInfo = heroSkinShop.find(s => String(s.ID) === fullId);
    if (skinInfo && skinInfo.LimitLabelPicUrl) labelFile = skinInfo.LimitLabelPicUrl;
    const labelUrl = `https://dl.ops.kgvn.garenanow.com/hok/SkinLabel/${labelFile}`;
    if (await checkImageExists(labelUrl)) {
      const labelImg = document.createElement('img');
      labelImg.src = labelUrl;
      labelImg.className = 'splash-label';
      labelImg.style.display = showSplashLabel ? 'block' : 'none';
      wrapper.appendChild(labelImg);
    }

    wrapper.appendChild(img);
    wrapper.appendChild(idTag);

    // Ảnh đầu tướng + viền theo màu trung bình
    const headId = convertSplashIdToHeadId(fullId);
    const headUrl = `https://dl.ops.kgtw.garenanow.com/CHT/HeroHeadPath/30${headId}head.jpg`;
    if (await checkImageExists(headUrl)) {
      const c = await getAverageColor(bigUrl);
      const headImg = document.createElement('img');
      headImg.src = headUrl;
      headImg.className = 'splash-head';
      headImg.style.border = `1px solid rgb(${Math.min(c.r + 40, 255)},${Math.min(c.g + 40, 255)},${Math.min(c.b + 40, 255)})`;
      wrapper.appendChild(headImg);
    }

    splashDiv.appendChild(wrapper);
  }

  card.dataset.loading = "false";
}

async function loadHeroHeads() {
  const allIDs = [];
  for (const range of ID_RANGES)
    for (let id = range.start; id <= range.end; id++) allIDs.push(id);
  allIDs.sort((a, b) => a - b);

  // Kiểm tra tồn tại đầu tướng SONG SONG, rồi thêm thẻ theo đúng thứ tự id
  const checked = await mapLimit(allIDs, 12, async (heroId) => {
    const idStr = String(heroId).padStart(3, '0');
    const headUrl = `https://dl.ops.kgtw.garenanow.com/CHT/HeroHeadPath/30${idStr}0head.jpg`;
    return { heroId, headUrl, exists: await checkImageExists(headUrl) };
  });

  for (const { heroId, headUrl, exists } of checked) {
    if (!exists) continue;
    const card = document.createElement('div');
    card.className = 'dat2-item';
    card.dataset.name = (heroList[heroId] || "").toLowerCase();

    const header = document.createElement('div');
    header.className = 'dat2-header';

    const img = document.createElement('img');
    img.src = headUrl;
    img.className = 'thumb';
    img.loading = 'lazy';
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

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim().toLowerCase();
  document.querySelectorAll('.dat2-item').forEach(card => {
    const name = (card.dataset.name || "").toLowerCase();
    let matchedId = '';
    for (const [id, heroName] of Object.entries(heroList)) {
      if (heroName.toLowerCase() === name) { matchedId = id; break; }
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
  document.querySelectorAll(".splash-id").forEach(t => t.style.display = showId ? 'block' : 'none');
}
function updateSplashLabelVisibility(showLabel) {
  document.querySelectorAll(".splash-label").forEach(l => l.style.display = showLabel ? 'block' : 'none');
}

const splashButton = document.getElementById('open-splash');
const splashContainer = document.getElementById('splash-container');

function collapseSplash() {
  if (splashContainer.classList.contains('hidden')) return;
  splashContainer.style.height = splashContainer.scrollHeight + "px";
  requestAnimationFrame(() => {
    splashContainer.style.transition = "height 0.3s ease";
    splashContainer.style.height = "0px";
  });
  setTimeout(() => splashContainer.classList.add('hidden'), 300);
}

splashButton.addEventListener('click', function (event) {
  event.stopPropagation();
  if (splashContainer.classList.contains('hidden')) {
    splashContainer.classList.remove('hidden');
    splashContainer.style.height = '0px';
    requestAnimationFrame(() => {
      splashContainer.style.transition = "height 0.3s ease";
      splashContainer.style.height = splashContainer.scrollHeight + "px";
      splashContainer.addEventListener("transitionend", function handler() {
        splashContainer.style.height = "auto";
        splashContainer.removeEventListener("transitionend", handler);
      });
    });
  } else {
    collapseSplash();
  }
});

splashContainer.addEventListener('click', (e) => e.stopPropagation());
document.addEventListener('click', collapseSplash);

function convertSplashIdToHeadId(fullId) {
  const base = fullId.slice(0, -2);
  const tail = parseInt(fullId.slice(-2));
  if (tail < 10) return base + tail;
  return fullId;
}

(async () => {
  headGrid.innerHTML = `
    <div style="
      font-size:12px;
      color:rgba(255,255,255,0.5);
    ">
      Đang tải danh sách tướng...
    </div>
  `;
  
  await loadHeroHeads();
  
  const loading = headGrid.querySelector('div');
  if (loading) loading.remove();
  
  updateHeroNames(showSplashId);
  updateSplashIdVisibility(showSplashId);
  updateSplashLabelVisibility(showSplashLabel);
})();