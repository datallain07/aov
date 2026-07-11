/* =========================================================================
   menudata.js — DỮ LIỆU + BỘ DỰNG GIAO DIỆN MENU (data-driven rendering)
   -------------------------------------------------------------------------
   Ý TƯỞNG TỐI ƯU:
   Trước đây mỗi mục menu là một khối <div class="menu-item">...</div> viết tay,
   lặp đi lặp lại cùng một cấu trúc -> HTML dài, sửa 1 chỗ phải sửa nhiều nơi,
   dễ sai. Vì tất cả dùng CHUNG một style, ta chỉ cần:
     1) Mô tả nội dung bằng DỮ LIỆU (mảng object bên dưới).
     2) Viết KHUÔN (template) 1 lần.
     3) Dùng vòng lặp .map() để sinh ra HTML.
   Thêm/bớt/sửa 1 mục = sửa 1 dòng dữ liệu, không đụng tới HTML.
   ========================================================================= */

/* --- 1. Danh sách MÁY CHỦ / APK (8 mục gần như giống hệt nhau) --- */
const SERVER_LIST = [
  { icon: "appicon/Z.webp",  title: "LIÊN QUÂN MOBILE [VN]",        pkg: "com.garena.game.kgvn",       label: "1.58.1.2 | XAPK", link: "https://drive.google.com/uc?export=download&id=1qsw2kfcvjqMPhkjOguf8Snrhl7XnoaPC" },
  { icon: "appicon/GL.webp", title: "ARENA OF VALOR [GL]",          pkg: "com.ngame.allstar.eu",       label: "1.58.1.2 | XAPK", link: "https://drive.google.com/uc?export=download&id=1qtIX8Os7MmqvQQtr5DGYNEeyS3FXYj48" },
  { icon: "appicon/TH.webp", title: "REALM OF VALOR [TH]",          pkg: "com.garena.game.kgth",       label: "1.58.1.7 | XAPK", link: "https://drive.google.com/uc?export=download&id=1qiyhRDMCCsweJ9hUxcDGA3d4RNIaz9EE" },
  { icon: "appicon/Z.webp",  title: "傳說對決 [TW]",                 pkg: "com.garena.game.kgtw",       label: "1.59.1.1 | XAPK", link: "https://drive.google.com/uc?export=download&id=1qjyOCRN3lMyAG0KHeivOTwT01VYRTjg_" },
  { icon: "appicon/CN.webp", title: "先行服 [CN]",                   pkg: "com.tencent.ngame.chty",     label: "1.58.5.1 | APK",  link: "https://drive.google.com/uc?export=download&id=1qyFH_LJ61gsbzrn0JqjeVA2Y_hxQTQL7" },
  { icon: "appicon/JP.webp", title: "アリーナ・オブ・ヴァラー [JP]",   pkg: "com.tencent.ngjp",           label: "1.58.1.2 | XAPK", link: "https://drive.google.com/uc?export=download&id=1q0vR8ofZOzgNubMh4tZ4euAYC3fgiM7T" },
  { icon: "appicon/ID.webp", title: "ARENA OF VALOR [ID]",          pkg: "com.garena.game.kgid",       label: "1.59.1.3 | XAPK", link: "https://drive.google.com/uc?export=download&id=1qWVLnuzvFdVENNlrSpvkKzPDcGVdy8bu" },
  { icon: "appicon/KR.webp", title: "펜타스톰 [KR]",                  pkg: "com.netmarble.pentastorm",   label: "Ngừng phát hành", link: null }
];

/* --- 2. Các mục MENU chính. type quyết định cách dựng:
      "action" = có id để JS khác gắn sự kiện (donate/chonmod/splash/server)
      "link"   = mục bấm mở link ngoài (lặp nhiều nhất -> lợi nhất khi gom data)
      "inner"  đi kèm khi mục cần chứa HTML con đặc biệt.                     --- */
const MENU_ITEMS = [
  { type: "action", id: "donate-item", icon: "icons/mb.png", title: "DONATE",
    sub: "Donate cho admin để ra mod nhanh hơn🐧" },

  { type: "action", id: "chonmod", icon: "icons/chonmod.png", title: "CHỌN MOD",
    sub: "Click để chọn một bản mod",
    inner: `<div class="skin-list" id="skin-list"></div>` },

  { type: "link", icon: "icons/caimod.png", title: "HƯỚNG DẪN CÀI MOD [iOS]",
    sub: "Click để xem hướng dẫn cài mod iOS", href: "https://youtu.be/TxR--AG0fuU" },

  { type: "link", icon: "icons/caimod.png", title: "HƯỚNG DẪN CÀI MOD [Android]",
    sub: "Click để xem hướng dẫn cài mod Android", href: "https://youtu.be/0j0pVny0ibI" },

  { type: "link", icon: "icons/res.png", title: "RESOURCES 8thg7 [Android]",
    sub: "Click để tải", href: "https://link4m.net/SntX7" },

  { type: "action", id: "open-splash", icon: "icons/image.png", title: "THƯ VIỆN SPLASH ART AOV",
    sub: "Click để xem splash art (tốn nhiều dữ liệu, nên sử dụng wifi)",
    inner: `<div class="hidden" id="splash-container">
              <input id="search" placeholder="🔎 Tìm kiếm bằng id hoặc tên...">
              <div class="dat2" id="head-grid"></div>
            </div>` },

  { type: "action", id: "open-server-list", icon: "icons/aov.png", title: "DANH SÁCH MÁY CHỦ AOV",
    sub: "Click để xem hoặc tải APK/XAPK",
    inner: `<div class="menu3-list">${SERVER_LIST.map(serverItemHTML).join("")}</div>` },

  { type: "link", icon: "icons/congdong.png", title: "NHÓM CHAT ZALO",
    sub: "Click để tham gia nhóm chat", href: "https://zalo.me/g/twwfye619" },

  { type: "link", icon: "icons/16.png", title: "XOÁ LOGO 16+",
    sub: "Click để tải bản mod xoá logo 16+ (Android&iOS)", href: "https://link4m.net/XzTOjPAn" }
];

/* --- 3. KHUÔN (template) — viết 1 lần, dùng cho mọi mục --- */
function serverItemHTML(s) {
  const dataLink = s.link ? ` data-link="${s.link}"` : "";
  return `<div class="menu3-item"${dataLink}>
    <img class="icon-img2" src="${s.icon}" loading="lazy" alt="">
    <div class="text">
      <strong>${s.title}</strong>
      <small>${s.pkg}</small>
      <div class="label-top-right">${s.label}</div>
    </div>
  </div>`;
}

function menuItemHTML(item) {
  const idAttr = item.id ? ` id="${item.id}"` : "";
  const icon = `<img class="icon-img" src="${item.icon}" loading="lazy" alt="">`;
  if (item.type === "link") {
    return `<div class="menu-item"${idAttr}>
      ${icon}
      <div class="text">
        <a href="${item.href}" target="_blank" rel="noopener">
          <strong>${item.title}</strong>
          <small>${item.sub}</small>
        </a>
      </div>
    </div>`;
  }
  // type "action": mục có hành vi riêng (JS khác gắn theo id)
  return `<div class="menu-item"${idAttr}>
    ${icon}
    <div class="text">
      <strong>${item.title}</strong>
      <small>${item.sub}</small>
      ${item.inner || ""}
    </div>
  </div>`;
}

/* --- 4. DỰNG: đổ toàn bộ menu vào #menu-items (chạy khi script defer thực thi,
        DOM đã sẵn sàng, TRƯỚC các script khác nên chúng vẫn tìm thấy id) --- */
(function renderMenu() {
  const mount = document.getElementById("menu-items");
  if (!mount) return;
  mount.innerHTML = MENU_ITEMS.map(menuItemHTML).join("");
})();
