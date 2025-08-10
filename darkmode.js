const darkToggle = document.getElementById("darkModeToggle");
const body = document.body;
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark-mode");
  darkToggle.checked = true;
} else {
  body.classList.remove("dark-mode");
  darkToggle.checked = false;
}
darkToggle.addEventListener("change", function () {
  if (this.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});