import CrudMongoose from "../dao/Mongoose/controllers/ProductManager.js";
import CartMongooseManager from "../dao/Mongoose/controllers/CartsManager.js";
import __dirname from "../utils.js";
import express from "express";
import { Router } from "express";
import userModel from "../dao/Mongoose/models/UserSchema.js";
import { io } from "../index.js";

const productsRouter = Router();
const productAll = new CrudMongoose();
const carts = new CartMongooseManager();

const products = async (options) => {
  let products = await productAll.findProducts(options);
  let data = {
    title: "Backend | Express",
    products: products[0].docs,
    hasPrevPage: products[0].hasPrevPage,
    prevPage: products[0].prevPage,
    prevLink: products[0].prevLink,
    page: products[0].page,
    hasNextPage: products[0].hasNextPage,
    nextPage: products[0].nextPage,
    nextlink: products[0].nextlink,
    category: products[0].category,
  };
  return data;
};
const cartProduct = async (idCart) => {
  let prod = await carts.findCartsById(idCart);
  let productsInCart = [];
  for (let i = 0; i < prod.products.length; i++) {
    productsInCart.push({
      id: prod.products[i]._id.id,
      title: prod.products[i]._id.title,
      thumbnail: prod.products[i]._id.thumbnail,
      price: prod.products[i]._id.price,
      totalPrice: prod.products[i].quantity * prod.products[i]._id.price,
      quantity: prod.products[i].quantity,
    });
  }
  let totalCart = productsInCart.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalPrice,
    0
  );

  return { productsInCart, totalCart };
};

productsRouter
  .use("/", express.static(__dirname + "/public"))
  .get("/:page", async (req, res) => {
    if (req.isAuthenticated()) {
      //Cargamos los productos en nuestra vista
      let data = await products(req.params);
      //Confirmamos Login del User
      req.session.login = true;
      //Obtenemos los Datos del User y guardamos en Session
      let user = await userModel
        .findById(req.session.passport.user)
        .populate("roles")
        .exec();
      req.session.nameUser = `${user.firstName} ${user.lastName}`;
      req.session.role = user.roles[0].name;
      //Comprobamos si tiene productos en el Carrito
      let productsCart = await cartProduct(user.cart._id.toString());
      let emptyCart = false;
      if (productsCart.totalCart === 0) emptyCart = true;
      //Generamos JWT y lo guardamos en una Cookie
      let token = await userModel.createToken(user);
      res.cookie("jwtCookie", token);
      //Renderizamos Vista con los Productos, Datos del User y Productos en Carrito del User si existen
      res.render("home", {
        ...data,
        nameUser: req.session.nameUser,
        rol: req.session.role,
        cartsProducts: productsCart.productsInCart,
        totalCart: productsCart.totalCart,
        emptyCart,
      });
      io.on("connection", (socket) => {
        let idCart = user.cart._id.toString();
        socket.on("addProductToCart", async (idProduct) => {
          await carts.addProductToCart(idCart, idProduct);
          let products = await cartProduct(idCart);
          io.sockets.emit("addProductToCart", products);
        });
        socket.on("deleteProductToCart", async (idProduct) => {
          await carts.deleteProductToCart(idCart, idProduct);
          let products = await cartProduct(idCart);
          io.sockets.emit("deleteProductToCart", products);
        });
      });
    } else {
      return res.status(200).redirect("/api/session");
    }
  })

export default productsRouter;
