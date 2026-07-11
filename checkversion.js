/* =========================================================================
   checkversion.js — kiểm tra bản mới (đã tối ưu)
   -------------------------------------------------------------------------
   TRƯỚC: fetch() lại TOÀN BỘ file HTML mỗi 2 giây chỉ để so 1 chuỗi version
          -> tốn băng thông, hao pin, chạy liên tục vô ích.
   NAY:   chỉ tải file version.txt (vài byte) mỗi 60 giây. Khi số version khác
          với lúc mở trang thì mới reload. Nhẹ hơn hàng trăm lần.
   (Đã bỏ đoạn nạp modlist.js?v=Date.now() cũ vì gây tải lại + không cần thiết:
    danh sách mod đã do skinlist.js dựng sẵn.)
   ========================================================================= */
(function autoReload() {
  const CHECK_EVERY_MS = 60000; // 60 giây
  let known = null;

  async function fetchVersion() {
    try {
      const res = await fetch("version.txt?_t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.text()).trim();
    } catch (e) {
      return null; // mất mạng thì bỏ qua, thử lại lần sau
    }
  }

  (async () => {
    known = await fetchVersion(); // mốc ban đầu
    setInterval(async () => {
      const latest = await fetchVersion();
      if (latest && known && latest !== known) location.reload();
    }, CHECK_EVERY_MS);
  })();
})();
