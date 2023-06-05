const signupLink = document.getElementById('signup-link')
const loginLink = document.getElementById('login-link')
const passwordLogin = document.getElementById('passwordLogin')
const eyeBtn = document.getElementById('eyeBtn')
const wrapper = document.getElementById('wrapper')
const slideLogin = document.getElementById('slideLogin')
const slideSignup = document.getElementById('slideSignup')
const eyeBtnSignup = document.getElementById('eyeBtnSignup')
const passwordSignup1 = document.getElementById('passwordSignup1')
const passwordSignup2 = document.getElementById('passwordSignup2')

eyeBtn.addEventListener('click', () => {
  if (passwordLogin.type === 'password') {
    passwordLogin.setAttribute('type', 'text')
    eyeBtn.classList.add('hide')
  } else {
    passwordLogin.setAttribute('type', 'password')
    eyeBtn.classList.remove('hide')
  }
})

eyeBtnSignup.addEventListener('click', () => {
  if (passwordSignup1.type === 'password') {
    passwordSignup1.setAttribute('type', 'text')
    passwordSignup2.setAttribute('type', 'text')
    eyeBtnSignup.classList.add('hide')
  } else {
    passwordSignup1.setAttribute('type', 'password')
    passwordSignup2.setAttribute('type', 'password')
    eyeBtnSignup.classList.remove('hide')
  }
})

slideLogin.addEventListener('click', () => {
  wrapper.classList.toggle('active')
})
slideSignup.addEventListener('click', () => {
  wrapper.classList.toggle('active')
})
signupLink.onclick = () => {
  slideSignup.click()
  return false
}
loginLink.onclick = () => {
  slideLogin.click()
  return false
}

// Recovery Password
const formRecover = document.getElementById('formRecover')
const recoverPassword = document.getElementById('recoverPassword')
const recoverModal = document.querySelector('.recoverContainer')
const recoverCancel = document.getElementById('recoverCancel')
const recoverSend = document.getElementById('recoverSend')
const recoverInput = document.getElementById('recoverInput')
const recoveryError = document.querySelector('.recoveryError')
const recoverySend = document.querySelector('.recoverySend')
const recoveryExpired = document.querySelector('.recoveryExpired')
const recoverMain = document.querySelector('.recoverMain')
const socket = io()

recoverPassword.addEventListener('click', () => {
  recoverModal.classList.add('recoverShow')
})
recoverCancel.addEventListener('click', () => {
  recoverModal.classList.remove('recoverShow')
})
recoverSend.addEventListener('click', e => {
  e.preventDefault()
  socket.emit('recovery', recoverInput.value)
})

socket.on('recoveryError', () => {
  if (recoverySend.classList.contains('recoveryMessageShow')) {
    recoverySend.classList.remove('recoveryMessageShow')
  }
  if (recoveryExpired.classList.contains('recoveryMessageShow')) {
    console.log('aqui')
    recoveryExpired.classList.remove('recoveryMessageShow')
  }
  recoveryError.classList.add('recoveryMessageShow')
  setTimeout(() => {
    recoverMain.style.marginTop = '0px'
  }, 500)
})

socket.on('recoverySend', () => {
  if (recoveryError.classList.contains('recoveryMessageShow')) {
    recoveryError.classList.remove('recoveryMessageShow')
  }
  if (recoveryExpired.classList.contains('recoveryMessageShow')) {
    recoveryExpired.classList.remove('recoveryMessageShow')
  }
  recoverySend.classList.add('recoveryMessageShow')
  recoverMain.style.marginTop = '0px'
  setTimeout(() => {
    formRecover.submit()
  }, 1000)
})
