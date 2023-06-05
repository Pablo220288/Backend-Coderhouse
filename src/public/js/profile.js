const updateRole = document.getElementById('updateRole')
const roleSelector = document.querySelector('.role')

updateRole.addEventListener('click', () => {
  console.log(roleSelector.disabled)
  if (roleSelector.disabled) {
    roleSelector.removeAttribute('disabled')
  } else {
    roleSelector.setAttribute('disabled', true)
  }
})
