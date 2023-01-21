class ProductManage {
  constructor() {
    this.products = [];
  }

  static id = 0;
  addProduct(title, description, price, thumbnail, code, stock) {
    //Validamos CODE repetido
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].code == code) {
        console.error(`${code} es un código existente`);
        break;
      }
    }

    let newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    //Validamos que esten todos los campos
    if (!Object.values(newProduct).includes(undefined)) {
      ProductManage.id++;
      this.products.push({
        ...newProduct,
        id: ProductManage.id,
      });
    } else {
      console.error("Todos los Campos son requeridos");
    }
  }

  getProducts() {
    return this.products;
  }

  exist(id) {
    return this.products.find((product) => product.id === id);
  }

  getProductById(id) {
    !this.exist(id) ? console.error("Not found") : console.log(this.exist(id));
  }
}

//Creamos un nuevo ProductManage
const productos = new ProductManage();

//Primera llamada a getProduct: El contenedor de productos esta vacio
console.log(productos.getProducts());

//Agrgamos 2 productos al contenedor
productos.addProduct(
  "Orgullo y Prejuicio",
  "Libro Romance",
  1500,
  "https://Orgullo-y-prejuicio-jane-austen.jpeg",
  "abc123",
  5
);

productos.addProduct(
  "Juego de Sombras",
  "Libro Infantil",
  2000,
  "https://juego-de-sombras-herve-tullet.jpeg",
  "abc124",
  3
);

//Segunda llamada a getProduct: El contenedor de productos contiene productos agregados
console.log(productos.getProducts());

//Agregamos otro producto con el mismo codigo
productos.addProduct(
  "Billy Summers",
  "Libro Suspenso",
  3500,
  "https://billy-summers-stephen-king.jpeg",
  "abc124",
  3
);

//Agregamos otro producto con capo faltante (sin Imagen)
productos.addProduct("Billy Summers", "Libro Suspenso", 3500, "abc125", 3);

//Buscamos un producto por su ID => Primero uno que no se enucuentra: Devuelve Error
productos.getProductById(5);
//Segundo uno que si se enucuentra: Devuelve el Producto Encontrado
productos.getProductById(2);
