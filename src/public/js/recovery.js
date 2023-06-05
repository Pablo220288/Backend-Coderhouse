const recoveryPassFirst = document.getElementById('recoveryPassFirst')
const recoveryPassSecond = document.getElementById('recoveryPassSecond')
const eyeRecoveryFrist = document.getElementById('eyeRecoveryFrist')
const eyeRecoverySecond = document.getElementById('eyeRecoverySecond')

eyeRecoveryFrist.addEventListener('click', () => {
  if (recoveryPassFirst.type === 'password') {
    recoveryPassFirst.setAttribute('type', 'text')
    eyeRecoveryFrist.classList.add('hide')
  } else {
    recoveryPassFirst.setAttribute('type', 'password')
    eyeRecoveryFrist.classList.remove('hide')
  }
})
eyeRecoverySecond.addEventListener('click', () => {
  if (recoveryPassSecond.type === 'password') {
    recoveryPassSecond.setAttribute('type', 'text')
    eyeRecoverySecond.classList.add('hide')
  } else {
    recoveryPassSecond.setAttribute('type', 'password')
    eyeRecoverySecond.classList.remove('hide')
  }
})

const recoveryForm = document.getElementById('recoveryForm')
const recoverSend = document.getElementById('recoverSend')
const recoveryPasswordError = document.querySelector('.recoveryPasswordError')
const passwordNotMatch = document.querySelector('.passwordNotMatch')
const recoveryPasswordSuccess = document.querySelector(
  '.recoveryPasswordSuccess'
)
const socket = io()

const removeMessage = () => {
  if (recoveryPasswordError.classList.contains('recoveryMessageShow')) {
    recoveryPasswordError.classList.remove('recoveryMessageShow')
  }
  if (passwordNotMatch.classList.contains('recoveryMessageShow')) {
    passwordNotMatch.classList.remove('recoveryMessageShow')
  }
}
recoverSend.addEventListener('click', e => {
  e.preventDefault()
  if (!recoveryPassFirst.value || !recoveryPassSecond.value) {
    removeMessage()
    passwordNotMatch.classList.add('recoveryMessageShow')
  } else if (recoveryPassFirst.value !== recoveryPassSecond.value) {
    removeMessage()
    passwordNotMatch.classList.add('recoveryMessageShow')
  } else {
    socket.emit('recoveryPassword', {
      passFirst: recoveryPassFirst.value,
      passSecond: recoveryPassSecond.value
    })
  }
})

socket.on('passwordRepeated', () => {
  removeMessage()
  recoveryPasswordError.classList.add('recoveryMessageShow')
})
socket.on('recoverySuccess', () => {
  removeMessage()
  recoveryPasswordSuccess.classList.add('recoveryMessageShow')
  setTimeout(() => {
    recoveryForm.submit()
  }, 1000)
})
