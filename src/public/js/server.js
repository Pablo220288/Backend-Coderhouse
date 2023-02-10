const itemTableContent = document.getElementById("itemTableContent");
const socket = io();
socket.emit("messaje", "Conectado con el Cliente por Sockets");

socket.on("estado", (data) => {
  console.log(data);
});

const cargarDom = (prod) => {
  itemTableContent.innerHTML += `
  <tr>
  <td>${prod.id}</td>
  <td class="itemLeft">${prod.title}</td>
  <td class="itemLeft">${prod.author}</td>
  <td class="itemLeft">${prod.description}</td>
  <td>${prod.price}</td>
  <td>${prod.status}</td>
  <td>${prod.category}</td>
  <td class="imgConten">
  <img class="imgTable" src=${prod.thumbnail} alt=${prod.title}/></td>
  <td>${prod.code}</td>
  <td>${prod.stock}</td>
</tr>
  `;
};

//Consultar Producto
const formGet = document.getElementById("formGet");
const resGet = document.getElementById("resGet");

formGet.addEventListener("submit", (e) => {
  e.preventDefault();
  let getProduct = document.getElementById("getProduct").value;
  socket.emit("getProduct", getProduct);
  resGet.innerHTML = "";
});

socket.on("getProduct", (data) => {
  resGet.innerHTML = data.messaje;
  itemTableContent.innerHTML = "";
  data.products.forEach((prod) => {
    cargarDom(prod);
  });
});

//Agregar Producto
const formPost = document.getElementById("formPost");
const resAdd = document.getElementById("resAdd");

formPost.addEventListener("submit", (e) => {
  e.preventDefault();
  let newProduct = document.getElementById("addProduct").value;
  socket.emit("addProduct", newProduct);
  resAdd.innerHTML = "";
});

socket.on("addProduct", (data) => {
  resAdd.innerHTML = data.messaje;
  itemTableContent.innerHTML = "";
  data.products.forEach((prod) => {
    cargarDom(prod);
  });
});

//Actualizar Producto
const formPut = document.getElementById("formPut");
const resPut = document.getElementById("resPut");

formPut.addEventListener("submit", (e) => {
  e.preventDefault();
  let idPutProduct = document.getElementById("idPutProduct").value;
  let infoPutProduct = document.getElementById("infoPutProduct").value
  socket.emit("putProduct", {
    id : idPutProduct,
    info : infoPutProduct
  });
  resPut.innerHTML = "";
});

socket.on("putProduct", (data) => {
  resPut.innerHTML = data.messaje;
  itemTableContent.innerHTML = "";
  data.products.forEach((prod) => {
    cargarDom(prod);
  });
});


//Eliminar por ID
const formDelete = document.getElementById("formDelete");
const resDelete = document.getElementById("resDelete");

formDelete.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = document.getElementById("productDelete").value;
  socket.emit("deleteProduct", id);
  resDelete.innerHTML = "";
});

socket.on("deleteProduct", (data) => {
  resDelete.innerHTML = data.messaje;
  itemTableContent.innerHTML = "";
  data.products.forEach((prod) => {
    cargarDom(prod);
  });
});
