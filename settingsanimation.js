document.addEventListener("DOMContentLoaded", function() {
  const body = document.body;
  const animationToggle = document.getElementById("toggle-animation");
  
  const disableAnimations = localStorage.getItem("disableAnimations") === "true";
  
  animationToggle.checked = !disableAnimations;
  
  if (disableAnimations) {
    body.classList.add("no-animation");
  }
  
  animationToggle.addEventListener("change", function() {
    if (this.checked) {
      body.classList.remove("no-animation");
      localStorage.setItem("disableAnimations", "false");
    } else {
      body.classList.add("no-animation");
      localStorage.setItem("disableAnimations", "true");
    }
  });
});