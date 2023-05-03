const formPurchase = document.getElementById('form-purchase')

formPurchase.addEventListener('submit', e => {
  e.preventDefault()
  const name = e.target[0].value
  const dni = e.target[1].value
  const address = e.target[2].value
  const addressNumber = e.target[3].value

  if (!name || !dni || !address || !addressNumber) {
    Toastify({
      text: 'Data Incomplete',
      className: 'warning',
      offset: {
        x: 0,
        y: 55
      }
    }).showToast()
  } else {
    formPurchase.submit()
  }
})
