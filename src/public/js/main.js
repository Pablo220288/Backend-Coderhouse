// Nav Scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav')
  nav.classList.toggle('nav-scroll', window.scrollY > 200)
})

// Indicador de Seccion
const menu = document.querySelectorAll('.menu')
const secciones = document.querySelectorAll('.seccion')
const seccion = new IntersectionObserver(
  items => {
    items.forEach(entrada => {
      if (entrada.isIntersecting) {
        const menuActual = Array.from(menu).find(
          item => item.dataset.url === entrada.target.id
        )
        menuActual.classList.add('active')
        for (const menuAnterior of menu) {
          menuAnterior !== menuActual && menuAnterior.classList.remove('active')
        }
      }
    })
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: 0.8
  }
)
secciones.forEach(item => seccion.observe(item))

// Menu Hamburguesa
const hamburger = document.querySelector('.hamburger')
const navMobile = document.querySelector('.nav-mobile-container')

const navItemMobile = document.getElementsByClassName('nav-mobile-item')

const navMobileOpenClose = () => {
  hamburger.classList.toggle('is-active')
  navMobile.classList.toggle('is-active')
}

hamburger.addEventListener('click', () => {
  navMobileOpenClose()
})

for (let i = 0; i < navItemMobile.length; i++) {
  navItemMobile[i].addEventListener('click', function () {
    setTimeout(() => {
      navMobileOpenClose()
    }, 200)
  })
}

// Modal carrito
const modalCarrito = document.getElementById('modal-carrito')
const openCarrito = document.getElementById('carrito')
const openCarritoXs = document.getElementById('carrito_xs')
const closeCarrito = document.getElementById('close-carrito')

openCarritoXs.addEventListener('click', e => {
  e.preventDefault()
  modalCarrito.classList.add('modal_show')
})

openCarrito.addEventListener('click', e => {
  e.preventDefault()
  modalCarrito.classList.add('modal_show')
})

closeCarrito.addEventListener('click', () => {
  modalCarrito.classList.remove('modal_show')
})
