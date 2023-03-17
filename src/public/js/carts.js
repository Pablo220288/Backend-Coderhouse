const cartsTableContent = document.getElementById("cartsTableContent");
const itemId = document.getElementById("itemId");
const itemQuantity = document.getElementById("itemQuantity");
const socket = io();
socket.emit("messaje", "Conectado con el Cliente por Sockets");

//Consultar Carrito & Producto
const formGetCart = document.getElementById("formGetCart");
const resGetCart = document.getElementById("resGetCart");

formGetCart.addEventListener("submit", (e) => {
  e.preventDefault();
  let getCart = document.getElementById("getCart").value;
  socket.emit("getCart", getCart);
  resGetCart.innerHTML = "";
  itemId.innerHTML = "";
  itemQuantity.innerHTML = "";
});
socket.on("getCart", (data) => {
  resGetCart.innerHTML = data.messaje;
  itemId.innerHTML = data.itemId;
  itemQuantity.innerHTML = data.itemQuantity;
  cartsTableContent.innerHTML = "";
  if (data.cart === true) {
    data.carts.forEach((cart) => {
      cartsTableContent.innerHTML += `
    <tr>
    <td>${cart._id}</td>
    <td>${cart.products.length}</td>
    </tr>`;
    });
  } else {
    data.products.forEach((cart) => {
      cartsTableContent.innerHTML += `
      <tr>
      <td>${cart.title} - (id: ${cart.id})</td>
      <td>${cart.quantity}</td>
      </tr>`;
    });
  }
});

//Agregar Carrito
const formPostCart = document.getElementById("formPostCart");
const resAddCart = document.getElementById("resAddCart");

formPostCart.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("addCart");
  resAddCart.innerHTML = "";
});
socket.on("addCart", (data) => {
  resAddCart.innerHTML = data.messaje;
  itemId.innerHTML = data.itemId;
  itemQuantity.innerHTML = data.itemQuantity;
  cartsTableContent.innerHTML = "";
  data.carts.forEach((cart) => {
    cartsTableContent.innerHTML += `
      <tr>
      <td>${cart._id}</td>
      <td>${cart.products.length}</td>
      </tr>`;
  });
});

//Agregar Producto en Carrito
const formProdInCart = document.getElementById("formProdInCart");
const resProdInCart = document.getElementById("resProdInCart");

formProdInCart.addEventListener("submit", (e) => {
  e.preventDefault();
  let idProduct = document.getElementById("idProduct").value;
  let idCart = document.getElementById("idCart").value;
  socket.emit("productInCart", {
    idProduct,
    idCart,
  });
  resProdInCart.innerHTML = "";
});

socket.on("productInCart", (data) => {
  resProdInCart.innerHTML = data.messaje;
  itemId.innerHTML = data.itemId;
  itemQuantity.innerHTML = data.itemQuantity;
  cartsTableContent.innerHTML = "";
  data.carts.forEach((cart) => {
    cartsTableContent.innerHTML += `
      <tr>
      <td>${cart._id}</td>
      <td>${cart.products.length}</td>
      </tr>`;
  });
});

//Eliminar Carrito
const formDeleteCart = document.getElementById("formDeleteCart");
const resDeleteCart = document.getElementById("resDeleteCart");

formDeleteCart.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = document.getElementById("productDeleteCart").value;
  socket.emit("deleteCart", id);
  resDeleteCart.innerHTML = "";
});
socket.on("deleteCart", (data) => {
  resDeleteCart.innerHTML = data.messaje;
  itemId.innerHTML = data.itemId;
  itemQuantity.innerHTML = data.itemQuantity;
  cartsTableContent.innerHTML = "";
  data.carts.forEach((cart) => {
    cartsTableContent.innerHTML += `
          <tr>
          <td>${cart._id}</td>
          <td>${cart.products.length}</td>
          </tr>`;
  });
});
