const containerCards = document.getElementById("containerCards");
const socket = io();
socket.emit("messaje", "Conectado con el Cliente por Sockets");

socket.on("estado", (data) => {
  console.log(data);
});

//Eliminar por ID
const formDelete = document.getElementById("formDelete");

formDelete.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = document.getElementById("productDelete").value;
  socket.emit("deleteProduct", id);
});

socket.on("deleteProduct", (data) => {
  containerCards.innerHTML = "";
  data.forEach((prod) => {
    containerCards.innerHTML += `
      <div class="cardContainer">
      <img
        class="imgCard"
        src=${prod.thumbnail}
        alt=${prod.title}
      />
      <div class="priceCard">
        <p>$</p>
        <p class="price">${prod.price}</p>
      </div>
      <div class="btnContainer">
      <div class="btnCard">
        <ion-icon class="icon" name="heart"></ion-icon>
        <span class="iconTooltip">like</span>
      </div>
      <div class="btnCard">
        <ion-icon class="icon more" name="add"></ion-icon>
        <span class="iconTooltip">more</span>
      </div>
      <div class="btnCard">
        <ion-icon class="icon" name="paper-plane"></ion-icon>
        <span class="iconTooltip">share</span>
      </div>
      <div class="btnCard">
        <ion-icon class="icon" name="cart-outline"></ion-icon>
        <span class="iconTooltip">add to cart</span>
      </div>
      </div>
      <div class="descriptionCard">
        <h2 class="titleCard">${prod.title}</h2>
        <div class="authorStock">
          <span>${prod.ahutor}</span>
          <div class="stockCard">
            <span>Stock:</span>
            <span>${prod.stock}</span>
          </div>
        </div>
      </div>
    </div>
      `;
  });
});
