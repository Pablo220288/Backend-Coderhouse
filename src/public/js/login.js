const signupLink = document.querySelector("form .signup-link a");
const passwordLogin = document.getElementById("passwordLogin");
const eyeBtn = document.getElementById("eyeBtn");
const wrapper = document.getElementById("wrapper");
const slideLogin = document.getElementById("slideLogin");
const slideSignup = document.getElementById("slideSignup");
const eyeBtnSignup = document.getElementById('eyeBtnSignup')
const passwordSignup1 = document.getElementById('passwordSignup1')
const passwordSignup2 = document.getElementById('passwordSignup2')

eyeBtn.addEventListener("click", () => {
  if (passwordLogin.type === "password") {
    passwordLogin.setAttribute("type", "text");
    eyeBtn.classList.add("hide");
  } else {
    passwordLogin.setAttribute("type", "password");
    eyeBtn.classList.remove("hide");
  }
});

eyeBtnSignup.addEventListener("click", () => {
  if (passwordSignup1.type === "password") {
    passwordSignup1.setAttribute("type", "text");
    passwordSignup2.setAttribute("type", "text");
    eyeBtnSignup.classList.add("hide");
  } else {
    passwordSignup1.setAttribute("type", "password");
    passwordSignup2.setAttribute("type", "password");
    eyeBtnSignup.classList.remove("hide");
  }
});

slideLogin.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});
slideSignup.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});
signupLink.onclick = () => {
  slideSignup.click();
  return false;
};
