const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const formLogin = document.getElementById("formLogin");
const formSignup = document.getElementById("formSignup");
const socket = io();

signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = e.target[0].value;
  let password = e.target[1].value;
  socket.emit("login", {
    email,
    password,
  });
});
socket.on("login", (data) => {
  if (data.link) {
    setTimeout(() => {
      window.location.href = `http://localhost:8080${data.link}`
    },2000);
  }
  Toastify({
    text: data.messaje,
    className: "info",
    position: "left",
    style: {
      background: "linear-gradient(to right,#2966cc,#3bd543)",
    }
  }).showToast();
});
formSignup.addEventListener("submit", (e) => {
  e.preventDefault();
});
