const menuToggle = document.querySelector(".menuToggle");
const addToCart = document.querySelectorAll(".addToCart");
const socket = io();

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
});

for (let i = 0; i < addToCart.length; i++) {
  addToCart[i].addEventListener("click", (e) => {
    let idProduct = addToCart[i].getAttribute("data-id");
    socket.emit("addProductToCart", idProduct);
    Toastify({
      text: "Product in Cart",
      className: "info",
      style: {
        background: "linear-gradient(to right, #88c043, #6d9a36)",
      },
      offset: {
        x: 0,
        y: 55,
      },
    }).showToast();
  });
}

//Agregamos Productos al Carrito
const cardPrevius = document.getElementById("cardPrevius");
const totalCart = document.getElementById("totalCart");
const updatecart = (data) => {
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
        <ion-icon name="trash-outline"></ion-icon>
      </div>
      <div class="price-conten">
        <p>$</p>
        <p class="price">${data.totalPrice}</p>
      </div>
    </div>
  </li>
  `;
};
socket.on("addProductToCart", (data) => {
  cardPrevius.textContent = "";
  totalCart.textContent = "";
  data.productsInCart.forEach((prod) => {
    updatecart(prod);
  });
  totalCart.innerHTML = data.totalCart;
});

//Eliminamos Porductos del Carrito
const cartDelete = document.querySelectorAll(".cartDelete");
if (cartDelete) {
  for (let i = 0; i < cartDelete.length; i++) {
    cartDelete[i].addEventListener("click", (e) => {
      let idProduct = cartDelete[i].getAttribute("data-id");
      socket.emit("deleteProductToCart", idProduct);
    });
  }
}
socket.on("deleteProductToCart", (data) => {
  cardPrevius.textContent = "";
  totalCart.textContent = "";
  data.productsInCart.forEach((prod) => {
    updatecart(prod);
  });
  totalCart.innerHTML = data.totalCart;
});
