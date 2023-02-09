//Nav Scroll
window.addEventListener("scroll", () => {
  let nav = document.querySelector(".nav");
  nav.classList.toggle("nav-scroll", window.scrollY > 400);
});

//Indicador de Seccion
const menu = document.querySelectorAll(".menu");
const secciones = document.querySelectorAll(".seccion");
const seccion = new IntersectionObserver(
  (items) => {
    items.forEach((entrada) => {
      if (entrada.isIntersecting) {
        let menuActual = Array.from(menu).find(
          (item) => item.dataset.url === entrada.target.id
        );
        menuActual.classList.add("active");
        for (let menuAnterior of menu) {
          menuAnterior != menuActual && menuAnterior.classList.remove("active");
        }
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.8,
  }
);
secciones.forEach((item) => seccion.observe(item));

//Menu Hamburguesa
const hamburger = document.querySelector(".hamburger");
const nav_mobile = document.querySelector(".nav-mobile-container");

let navItemMobile = document.getElementsByClassName("nav-mobile-item");

let navMobileOpenClose = () => {
  hamburger.classList.toggle("is-active");
  nav_mobile.classList.toggle("is-active");
};

hamburger.addEventListener("click", () => {
  navMobileOpenClose();
});

for (let i = 0; i < navItemMobile.length; i++) {
  navItemMobile[i].addEventListener("click", function () {
    setTimeout(() => {
      navMobileOpenClose();
    }, 200);
  });
}

//Modal carrito
const modalCarrito = document.getElementById("modal-carrito");
const openCarrito = document.getElementById("carrito");
const openCarritoXs = document.getElementById("carrito_xs");
const closeCarrito = document.getElementById("close-carrito");

const alertVacio = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "El Carrito esta Vacio!",
    footer: "Vamos a llenar esa Bodega..!!",
  });
};

openCarritoXs.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(carrito.length);
  carrito.length === 0
    ? alertVacio()
    : modalCarrito.classList.add("modal_show");
});

openCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  carrito.length === 0
    ? alertVacio()
    : modalCarrito.classList.add("modal_show");
});

closeCarrito.addEventListener("click", () => {
  modalCarrito.classList.remove("modal_show");
});