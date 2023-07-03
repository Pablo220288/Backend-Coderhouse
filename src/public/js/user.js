const usersTableContent = document.getElementById('usersTableContent')
const socket = io()

const formGetUser = document.getElementById('formGetUser')
const resGetUser = document.getElementById('resGetUser')

const cargarDom = user => {
  const lastConnection = new Date(user.lastConnection).toLocaleString()
  usersTableContent.innerHTML += `
  <tr>
  <td>${user._id}</td>
  <td class="itemLeft">${user.firstName}</td>
  <td class="itemLeft">${user.lastName}</td>
  <td class="itemLeft">${user.age}</td>
  <td>${user.email}</td>
  <td>${user.roles[0].name}</td>
  <td>${lastConnection}</td>
  </tr>
  `
}

// Consultar Usuarios
formGetUser.addEventListener('submit', e => {
  e.preventDefault()
  const getUser = document.getElementById('getUser').value
  socket.emit('getUser', getUser)
  resGetUser.innerHTML = ''
})

socket.on('getUser', data => {
  resGetUser.innerHTML = data.messaje
  usersTableContent.innerHTML = ''
  data.users.forEach(user => {
    cargarDom(user)
  })
})

// Crear usuario
const formPostUser = document.getElementById('formPostUser')
const updateUserTabs = document.querySelector('.updateUserTabs')
const resAddUser = document.getElementById('resAddUser')

formPostUser.addEventListener('submit', e => {
  e.preventDefault()
  resAddUser.innerHTML = ''

  const { firstName, lastName } = updateUserTabs.children[0].children
  const { age, email } = updateUserTabs.children[1].children
  const { password, retryPassword } = updateUserTabs.children[2].children

  if (
    !firstName.value ||
    !lastName.value ||
    !age.value ||
    !email.value ||
    !password.value ||
    !retryPassword.value
  ) {
    resAddUser.innerHTML = 'Complete todos los campos'
  } else if (password.value !== retryPassword.value) {
    resAddUser.innerHTML = 'Las contraseñas no coinciden'
  } else {
    const newUser = {
      firstName: firstName.value,
      lastName: lastName.value,
      age: age.value,
      email: email.value,
      password: password.value
    }
    socket.emit('addUser', newUser)
    resAddUser.innerHTML = ''
  }
})

socket.on('addUser', data => {
  resAddUser.innerHTML = data.messaje
  usersTableContent.innerHTML = ''
  data.users.forEach(user => {
    cargarDom(user)
  })
})

// Eliminar por ID
const formDeleteUser = document.getElementById('formDeleteUser')
const resDeleteUser = document.getElementById('resDeleteUser')

formDeleteUser.addEventListener('submit', e => {
  e.preventDefault()
  const id = document.getElementById('deleteUser').value
  socket.emit('deleteUser', id)
  resDeleteUser.innerHTML = ''
})

socket.on('deleteUser', data => {
  console.log(data)
  resDeleteUser.innerHTML = data.messaje
  usersTableContent.innerHTML = ''
  data.users.forEach(user => {
    cargarDom(user)
  })
})

// Eliminamos a los Usuarios por Last Connection

const deleteLastUsers = document.getElementById('deleteLastUsers')
const resDeleteLastUsers = document.getElementById('resDeleteLastUsers')

deleteLastUsers.addEventListener('click', () => {
  socket.emit('lastDeleteUser')
})

socket.on('lastDeleteUser', data => {
  console.log(data)
  resDeleteLastUsers.innerHTML = data.messaje
  usersTableContent.innerHTML = ''
  data.users.forEach(user => {
    cargarDom(user)
  })
})
