const updateAvatar = document.getElementById('updateAvatar')
const inputAvatar = document.querySelector('.inputAvatar')
const formAvatar = document.getElementById('formAvatar')
const socket = io()

updateAvatar.addEventListener('click', () => {
  inputAvatar.click()
})

inputAvatar.addEventListener('change', () => {
  Toastify({
    text: 'updating avatar ...',
    className: 'info',
    style: {
      background: 'linear-gradient(to right, #88c043, #6d9a36)'
    },
    offset: {
      x: 0,
      y: 55
    }
  }).showToast()
  setTimeout(() => {
    formAvatar.submit()
  }, 2000)
})

const updateRole = document.getElementById('updateRole')
const roleSelector = document.querySelector('.role')
const selectorRole = document.getElementById('selectorRole')

updateRole.addEventListener('click', () => {
  if (roleSelector.disabled) {
    roleSelector.removeAttribute('disabled')
    roleSelector.classList.add('cursor')
    selectorRole.classList.add('selectorShow')
  } else {
    roleSelector.setAttribute('disabled', true)
    roleSelector.classList.remove('cursor')
    selectorRole.classList.remove('selectorShow')
  }
})

const updateAge = document.getElementById('updateAge')
const ageSelector = document.querySelector('.age')
const selectorInput = document.getElementById('selectorInput')

updateAge.addEventListener('click', () => {
  if (ageSelector.disabled) {
    ageSelector.removeAttribute('disabled')
    ageSelector.classList.add('cursor')
    selectorInput.classList.add('selectorInputShow')
  } else {
    ageSelector.setAttribute('disabled', true)
    ageSelector.classList.remove('cursor')
    selectorInput.classList.remove('selectorInputShow')
  }
})

const formProfile = document.getElementById('formProfile')
const updateProfile = document.getElementById('updateProfile')

updateProfile.addEventListener('click', e => {
  e.preventDefault()
  roleSelector.removeAttribute('disabled')
  ageSelector.removeAttribute('disabled')
  formProfile.submit()
})

const deleteUser = document.getElementById('deleteUser')
const deleteAccountContainer = document.getElementById('deleteAccountContainer')
const formDeleteAccount = document.getElementById('formDeleteAccount')
const passwordDeleteAccount = document.getElementById('passwordDeleteAccount')
const deleteAccountCancel = document.getElementById('deleteAccountCancel')
const deleteAccount = document.getElementById('deleteAccount')

deleteUser.addEventListener('click', () => {
  deleteAccountContainer.classList.add('recoverShow')
})
deleteAccountCancel.addEventListener('click', () => {
  deleteAccountContainer.classList.remove('recoverShow')
})

deleteAccount.addEventListener('click', e => {
  e.preventDefault()
  socket.emit('deleteAccount', {
    password: passwordDeleteAccount.value
  })
})

const deleteAccountMessage = document.getElementById('deleteAccountMessage')

socket.on('deleteAccountError', () => {
  deleteAccountMessage.classList.add('recoveryMessageShow')
})

passwordDeleteAccount.addEventListener('keydown', () => {
  if (deleteAccountMessage.classList.contains('recoveryMessageShow')) {
    deleteAccountMessage.classList.remove('recoveryMessageShow')
  }
})
socket.on('deleteAccountSuccess', () => {
  formDeleteAccount.submit()
})

// Formulario Document Identification
const identification = document.getElementById('identification')
const formIdentification = document.getElementById('formIdentification')
const inputIdentification = document.querySelector('.inputIdentification')

if (identification !== null) {
  identification.addEventListener('click', () => {
    inputIdentification.click()
  })
  inputIdentification.addEventListener('change', () => {
    formIdentification.submit()
  })
}

// Formulario Document Address

const address = document.getElementById('address')
const formAddress = document.getElementById('formAddress')
const inputAddress = document.querySelector('.inputAddress')

if (address !== null) {
  address.addEventListener('click', () => {
    inputAddress.click()
  })
  inputAddress.addEventListener('change', () => {
    formAddress.submit()
  })
}
// Formulario Document Account

const account = document.getElementById('account')
const formAccount = document.getElementById('formAccount')
const inputAccount = document.querySelector('.inputAccount')

if (account !== null) {
  account.addEventListener('click', () => {
    inputAccount.click()
  })
  inputAccount.addEventListener('change', () => {
    formAccount.submit()
  })
}
