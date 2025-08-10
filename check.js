(async function autoReload() {
  const creditEl = document.querySelector('.credit');
  if (!creditEl) return;

  const currentVersion = creditEl.textContent.match(/Ver([\d.]+)/)?.[1];

  async function fetchLatestVersion() {
    const res = await fetch(window.location.href.split('#')[0] + '?_t=' + Date.now());
    const html = await res.text();
    return html.match(/<div class="credit">©datallain07 \| Ver([\d.]+)<\/div>/)?.[1];
  }

  setInterval(async () => {
    const latestVersion = await fetchLatestVersion();
    if (latestVersion && latestVersion !== currentVersion) {
      location.reload(true);
    }
  }, 2000);
})();