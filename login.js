const matrix = ["dw2#p78E", "1i3g4Kyf", "uxoXbkUm", "HDtjWah0", "N5crInzG", "eOJC9SPB", "lVsvFA@Z", "LQqYT6RM", "/:.-_?"];

const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const submitLogin = document.getElementById("submitLogin");
const accountStatus = document.getElementById("accountStatus");
const memberStatus = document.getElementById("memberStatus");
const avatar = document.querySelector(".avatar");
const defaultAvatar = "img/default.png";
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
}

function getDaysLeft(dateStr) {
  return Math.ceil((parseDate(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function shuffleEncoded(encoded) {
  const mid = Math.floor(encoded.length / 2);
  return encoded.slice(mid) + encoded.slice(0, mid);
}

function unshuffleEncoded(shuffled) {
  const mid = Math.floor(shuffled.length / 2);
  return shuffled.slice(-mid) + shuffled.slice(0, -mid);
}

function decodeUserPassword(encoded) {
  const code = unshuffleEncoded(encoded);
  if (code.length % 4 !== 0) throw new Error("Code không hợp lệ");
  return code.match(/.{4}/g).map(c => {
    const row = 8 - parseInt(c[0]);
    const col = 8 - parseInt(c[1]);
    if (row < 0 || row > 7 || col < 0 || col > 7) throw new Error("Code sai");
    return matrix[row][col];
  }).join('');
}

function setAvatarClickable(enable) {
  if (enable) {
    avatar.style.cursor = "pointer";
    avatar.addEventListener("click", avatarClickHandler);
  } else {
    avatar.style.cursor = "default";
    avatar.removeEventListener("click", avatarClickHandler);
  }
}

function avatarClickHandler() {
  const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (!savedUser) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      avatar.src = reader.result;
      localStorage.setItem(`avatar_${savedUser.username}`, reader.result);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function renderUser(user) {
  const savedUser = user || JSON.parse(localStorage.getItem("loggedUser"));
  if (!savedUser) {
    accountStatus.textContent = "Hiện chưa đăng nhập";
    memberStatus.textContent = "Liên hệ admin để đăng kí";
    setAvatarClickable(false);
    avatar.src = defaultAvatar;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    return;
  }
  
  avatar.src = localStorage.getItem(`avatar_${savedUser.username}`) || savedUser.avatar || defaultAvatar;
  setAvatarClickable(true);
  
  const daysLeft = savedUser.expire ? getDaysLeft(savedUser.expire) : 0;
accountStatus.innerHTML = `Xin chào! ${
  savedUser.expire && daysLeft > 0
    ? `<span class="vip">${savedUser.username}</span>`
    : savedUser.username
}`;
if (savedUser.expire) {
  if (daysLeft > 0) {
    memberStatus.innerHTML = `<span style="color: gold;">
      Gói thành viên còn: ${daysLeft} ngày (${savedUser.expire})
    </span>`;
  } else {
    memberStatus.innerHTML = `<span style="color: red;">
      Gói thành viên: Đã hết hạn (${savedUser.expire})
    </span>`;
  }
} else {
  memberStatus.textContent = "Gói thành viên: Không";
}
  
  memberStatus.classList.toggle("member-vip", daysLeft > 0);
  accountStatus.classList.add("show");
  memberStatus.classList.add("show");
  
  loginBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
}

function login(username, password) {
  const user = accounts.find(acc => acc.username === username);
  if (!user) return alert("Sai tài khoản hoặc mật khẩu!");
  try {
    if (decodeUserPassword(user.password) === password) {
      localStorage.setItem("loggedUser", JSON.stringify(user));
      renderUser(user);
      loginModal.classList.remove("show");
      showToast("Đăng nhập thành công!");
    } else alert("Sai tài khoản hoặc mật khẩu!");
  } catch (e) {
    console.error(e);
    alert("Sai tài khoản hoặc mật khẩu!");
  }
}

loginBtn.addEventListener("click", () => loginModal.classList.add("show"));
submitLogin.addEventListener("click", () => {
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;
  login(username, password);
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  avatar.src = defaultAvatar;
  setAvatarClickable(false);
  accountStatus.textContent = "Hiện chưa đăng nhập";
  memberStatus.textContent = "Chưa có tài khoản? Liên hệ admin để đăng kí";
  memberStatus.classList.remove("member-vip");
  loginBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
});

togglePassword.addEventListener("click", () => {
  const isPwd = passwordInput.type === "password";
  passwordInput.type = isPwd ? "text" : "password";
  togglePassword.style.color = isPwd ? "#1e90ff" : "#ccc";
});

loginModal.addEventListener("click", e => {
  if (e.target === loginModal) loginModal.classList.remove("show");
});

window.addEventListener("load", () => {
  const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (savedUser) renderUser(savedUser);
  else setAvatarClickable(false);
});