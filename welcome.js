const popup = document.getElementById("welcome-popup");
const closeBtn = document.getElementById("close-popup");
let canClose = false;

setTimeout(() => {
  popup.style.display = "flex";
  requestAnimationFrame(() => {
    popup.classList.add("show");
    popup.style.opacity = "1";
  });
  
  let countdown = 0;
  closeBtn.disabled = true;
  closeBtn.style.opacity = "0.5";
  closeBtn.style.pointerEvents = "none";
  closeBtn.style.cursor = "not-allowed";
  //closeBtn.textContent = `Có thể đóng sau ${countdown}s`;
  
  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      closeBtn.textContent = `Có thể đóng sau ${countdown}s`;
    } else {
      clearInterval(countdownInterval);
      canClose = true;
      closeBtn.disabled = false;
      closeBtn.textContent = "";
      closeBtn.style.opacity = "1";
      closeBtn.style.pointerEvents = "auto";
      closeBtn.style.cursor = "pointer";
    }
  }, 1000);
}, 100);

function closePopup() {
  if (!canClose) return;
  popup.classList.remove("show");
  popup.style.opacity = "0";
  
  if (toggleMusic.checked) {
    musicPlayer.play().catch(() => {
      console.log('Autoplay bị chặn');
    });
  } else {
    musicPlayer.pause();
  }
}

popup.addEventListener("transitionend", function(e) {
  if (e.propertyName === "opacity" && !popup.classList.contains("show")) {
    popup.style.display = "none";
  }
});

closeBtn.addEventListener("click", closePopup);
popup.addEventListener("click", function(e) {
  if (e.target === popup && canClose) {
    closePopup();
  }
});