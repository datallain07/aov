document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem("skinsList") || "[]");
  const currentList = skins.map((s) => `${s.champion}-${s.name}`);
  const newSkins = currentList.filter((s) => !storedData.includes(s));
  if (newSkins.length > 0) {
    showToast(`Có thêm ${newSkins.length} mod mới🎉`);
  }
  localStorage.setItem("skinsList", JSON.stringify(currentList));
});