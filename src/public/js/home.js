const addToCart = document.querySelectorAll('.addToCart')
const socket = io()

for (let i = 0; i < addToCart.length; i++) {
  addToCart[i].addEventListener('click', e => {
    const idProduct = addToCart[i].getAttribute('data-id')
    socket.emit('addProductToCart', idProduct)
  })
}

// Agregamos Productos al Carrito
const cardPrevius = document.getElementById('cardPrevius')
const totalCart = document.getElementById('totalCart')
const cartDelete = document.querySelectorAll('.cartDelete')
const vaciarcarrito = document.getElementById('vaciar-carrito')
const sectionTotal = document.getElementById('sectionTotal')
const sectionButtons = document.getElementById('sectionButtons')
const popupCartXs = document.getElementById('popupCartXs')
const popupCart = document.getElementById('popupCart')

// Si ahi Productos le genero las funciones a los botones para eliminar los productos
if (cartDelete) {
  for (let i = 0; i < cartDelete.length; i++) {
    cartDelete[i].addEventListener('click', e => {
      const idProduct = cartDelete[i].getAttribute('data-id')
      socket.emit('deleteProductToCart', idProduct)
      cartDelete[i].classList.add('clicked')
    })
  }
}

const updatecart = data => {
  cardPrevius.innerHTML += `
  <li class="cardPreviusItems">
    <div class="img-info">
      <img alt=${data.title} class="imgCartPrevius" src=${data.thumbnail}></img>
    <div class="infoPrevius">
     <p class="infoTitle">${data.title}</p>
     <p class="infoCant"><strong>${data.quantity} </strong>x<strong> ${data.price}</strong></p>
      <div class="infoFin">
        <p class="fin"><strong>12</strong> pagos con</p>
         <img class="visa" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Visa_Logo.png/640px-Visa_Logo.png" alt="Visa"></img>
      </div>
    </div>
    </div>
      <div class="delete-price">
      <div class="cartDelete" id="cartDelete" data-id=${data.id}>
      <span class="icon">
        <span class="lid"></span>
        <span class="can"></span>
        <span class="trash"></span>
      </span>
      </div>
      <div class="price-conten">
        <p>$</p>
        <p class="price">${data.totalPrice}</p>
      </div>
    </div>
  </li>
  `
}
const emptyCart = () => {
  cardPrevius.innerHTML += `
  <div class="preloader">
    <svg class="cart" role="img" aria-label="Shopping cart line animation" viewBox="0 0 128 128" width="128px" height="128px" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8">
        <g class="cart__track" stroke="hsla(0,10%,10%,0.1)">
          <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
          <circle cx="43" cy="111" r="13" />
          <circle cx="102" cy="111" r="13" />
        </g>
        <g class="cart__lines" stroke="currentColor">
          <polyline class="cart__top" points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" stroke-dasharray="338 338" stroke-dashoffset="-338" />
          <g class="cart__wheel1" transform="rotate(-90,43,111)">
            <circle class="cart__wheel-stroke" cx="43" cy="111" r="13" stroke-dasharray="81.68 81.68" stroke-dashoffset="81.68" />
          </g>
          <g class="cart__wheel2" transform="rotate(90,102,111)">
            <circle class="cart__wheel-stroke" cx="102" cy="111" r="13" stroke-dasharray="81.68 81.68" stroke-dashoffset="81.68" />
          </g>
        </g>
      </g>
    </svg>
    <div class="preloader__text">
      <p class="preloader__msg">Empty Cart</p>
    </div>
  </div>
`
}
const popupVisible = data => {
  popupCart.innerHTML = `<p>${data.countCart}</p>`
  popupCart.style.opacity = '1'
  popupCartXs.innerHTML = `<p>${data.countCart}</p>`
  popupCartXs.style.opacity = '1'
}
const domHidden = () => {
  sectionTotal.style.display = 'none'
  sectionButtons.style.display = 'none'
  popupCart.innerHTML = ''
  popupCart.style.opacity = '0'
  popupCartXs.innerHTML = ''
  popupCartXs.style.opacity = '0'
}

socket.on('addProductToCart', data => {
  cardPrevius.textContent = ''
  totalCart.textContent = ''
  data.productsInCart.forEach(prod => {
    updatecart(prod)
  })
  totalCart.innerHTML = data.totalCart
  sectionTotal.style.display = 'flex'
  sectionButtons.style.display = 'flex'
  popupVisible(data)
  // Creamos funcion para elimiar del Carrito
  const cartDelete = document.querySelectorAll('.cartDelete')
  for (let i = 0; i < cartDelete.length; i++) {
    cartDelete[i].addEventListener('click', e => {
      const idProduct = cartDelete[i].getAttribute('data-id')
      socket.emit('deleteProductToCart', idProduct)
      cartDelete[i].classList.add('clicked')
    })
  }
  // Mostramos mensaje de Producto Agregado
  Toastify({
    text: 'Product in Cart',
    className: 'info',
    style: {
      background: 'linear-gradient(to right, #88c043, #6d9a36)'
    },
    offset: {
      x: 0,
      y: 55
    }
  }).showToast()
})

socket.on('stockInsufficient', () => {
  // Mostramos mensaje de Stock Insuficiente
  Toastify({
    text: 'Producto sin Stock',
    className: 'warning',
    offset: {
      x: 0,
      y: 55
    }
  }).showToast()
})

socket.on('deleteProductToCart', data => {
  setTimeout(() => {
    cardPrevius.textContent = ''
    totalCart.textContent = ''
    if (data.totalCart === 0) {
      emptyCart()
      domHidden()
    } else {
      data.productsInCart.forEach(prod => {
        updatecart(prod)
      })
      popupVisible(data)
      totalCart.innerHTML = data.totalCart
    }
  }, 500)
})

vaciarcarrito.addEventListener('click', () => {
  socket.emit('emptyCart')
})
socket.on('emptyCart', data => {
  cardPrevius.textContent = ''
  totalCart.textContent = ''
  emptyCart()
  domHidden()
})

const cardMore = document.getElementById('cardMore')
cardMore.addEventListener('click', () => {
  cardMore.classList.toggle('is-selected')
})

const purchaserLink = document.getElementById('purchaser-link')
purchaserLink.addEventListener('click', e => {
  e.preventDefault()
  socket.emit('purchaserCart')
})

socket.on('insufficientStock', data => {
  const productTitle = data.map(data => data.title)
  Swal.fire({
    title: 'Stock Insuficiente',
    html:
      `<h6> Los productos "${productTitle.toString()}" no cuentan con Stock</h6>` +
      '<p>Desea eliminarlos del carrito para continuar con la compra.?</p>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      htmlContainer: 'swalText'
    }
  }).then(result => {
    if (result.isConfirmed) {
      const productId = data.map(data => data.idProduct)
      for (let i = 0; i < productId.length; i++) {
        socket.emit('deleteProductToCart', productId[i])
      }
      Swal.fire('Deleted!', 'Your product has been deleted.', 'success')
    }
  })
})
socket.on('purchaserCart', () => {
  window.location = purchaserLink.href
})
