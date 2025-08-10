document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const animationToggle = document.getElementById("toggle-animation");
  const disableAnimations = localStorage.getItem("disableAnimations") === "true";
  if (disableAnimations) {
    body.classList.add("no-animation");
    animationToggle.checked = true;
  }
  animationToggle.addEventListener("change", function () {
    if (this.checked) {
      body.classList.add("no-animation");
      localStorage.setItem("disableAnimations", "true");
    } else {
      body.classList.remove("no-animation");
      localStorage.setItem("disableAnimations", "false");
    }
  });
});