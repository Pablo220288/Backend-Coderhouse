const subscribeForm = document.getElementById('subscribeForm')
const subscribeButton = document.querySelector('.subscribeButton')
subscribeForm.addEventListener('submit', e => {
  e.preventDefault()
  const text = e.submitter.lastChild.textContent
  if (text === 'Suscribirme') {
    subscribeButton.innerHTML = ''
    subscribeButton.innerHTML = `
    <img class='sad'
    src='https://cdn-icons-png.flaticon.com/512/42/42735.png?w=740&t=st=1681834410~exp=1681835010~hmac=44aaabd977b39096b49d092cf827f696b8f9b4af1681edd7eefd32bed66aa6ef'
    alt='Enamorado'/><span>Ya no Enviar</span>`
  } else {
    subscribeButton.innerHTML = ''
    subscribeButton.innerHTML = `
    <img class='love'
    src='https://cdn-icons-png.flaticon.com/512/48/48974.png?w=740&t=st=1681832071~exp=1681832671~hmac=e140682aed2184e0652ba559185586d6a731bfd6a567e8cedc9125d52597cf5a'
    alt='Enamorado'/><span>Suscribirme</span>`
  }
})
