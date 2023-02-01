import { Router } from "express";
import ProductManager from "../models/ProductManager.js";

const cartsRouter = Router();

//Creamos Manero de Archvos por FileSystem
const productos = new ProductManager();
const carts = productos.readProducts(productos.pathCarts);

//Ruta para Agregar Carritos
cartsRouter.post("/", async (req, res) => {
  let id = productos.generateId();
  let cartsOld = await carts;
  let allCarts = [...cartsOld, { id: id, productos: [] }];
  await productos.writeProducts(productos.pathCarts, allCarts);
  res.send(
    `Carrito Creado Exitosamente.\n Carritos Existentes ${allCarts.length}`
  );
});
//Ruta para Consultar Productos en Carrito por ID
cartsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  let cartById = await productos.exist(id, productos.pathCarts);
  if (!cartById)
    return res.status(404).send({ error: "El Carrito Solicitado no existe" });
  res.send(cartById.productos);
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  let idCart = req.params.cid;
  let idProduct = req.params.pid;

  //Comprobamos si existe el Carrito
  let cartById = await productos.exist(idCart, productos.pathCarts);
  if (!cartById)
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/img/404.gif",
      error: "El Carrito no existe",
    });

  //Comprobamos si existe el Producto a Agregar
  let productById = await productos.exist(idProduct, productos.pathProducts);
  if (!productById)
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/img/404.gif",
      error: "El producto Seleccionado no existe",
    });

  //Cargamos el Producto en el Carrito
  console.log(cartById.productos.some((prod) => prod.id === idProduct));

  /*   cartById.productos.push({ id: productById.id, quantity: 1 });

  //lo Eliminamos del Array
  const cartsOld = await productos.deleteProducts(idCart, productos.pathCarts);

  //Lo subimos Modificado
  let allCarts = [...cartsOld, cartById];
  await productos.writeProducts(productos.pathCarts, allCarts);*/
  res.send(`Producto "${productById.title}" agregado al carrito: ${idCart}`);
});

export default cartsRouter;
