document.addEventListener("DOMContentLoaded", function() {
  const chonModBtn = document.getElementById("chonmod");
  const modNoticePopup = document.getElementById("mod-notice-popup");
  const dontShowModNotice = document.getElementById("mod-notice-dont-show");
  const countdownText = document.getElementById("mod-notice-countdown");
  const closeHint = document.getElementById("mod-notice-close-hint");
  
  let canCloseNotice = false;
  
  function openModNoticePopup() {
    if (localStorage.getItem("hideModNoticePopup") === "true") return;
    
    modNoticePopup.style.display = "flex";
    requestAnimationFrame(() => modNoticePopup.classList.add("show"));
    canCloseNotice = false;
    closeHint.style.display = "none";
    
    let countdown = 5;
    countdownText.textContent = `Có thể đóng sau ${countdown} giây...`;
    
    const timer = setInterval(() => {
      countdown--;
      countdownText.textContent = `Có thể đóng sau ${countdown} giây...`;
      if (countdown <= 0) {
        clearInterval(timer);
        canCloseNotice = true;
        countdownText.style.display = "none";
        closeHint.style.display = "block";
      }
    }, 1000);
  }
  
  function closeModNoticePopup() {
    if (!canCloseNotice) return;
    if (dontShowModNotice.checked) {
      localStorage.setItem("hideModNoticePopup", "true");
    }
    modNoticePopup.classList.remove("show");
    modNoticePopup.addEventListener("transitionend", function handler() {
      modNoticePopup.style.display = "none";
      modNoticePopup.removeEventListener("transitionend", handler);
      countdownText.style.display = "block";
      countdownText.style.color = "rgba(0,0,0,0.6)";
    });
  }
  
  
  openModNoticePopup();
  
  if (chonModBtn) {
    chonModBtn.addEventListener("click", openModNoticePopup);
  }
  
  modNoticePopup.addEventListener("click", function(e) {
    if (e.target === modNoticePopup) {
      closeModNoticePopup();
    }
  });
});