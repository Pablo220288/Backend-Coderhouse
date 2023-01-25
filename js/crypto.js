//Algoritmo: Forma de Encriptar
//Key: Valor unico
//IV: Vector de complejidad

//Importamos ES6
import crypto from "crypto";

//Variables de Encriptacion
const algoritmo = "aria-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Funcion para Encriptar
const encriptar = (password) => {
  let cipher = crypto.createCipheriv(algoritmo, Buffer.from(key), iv);
  let passwordEncripted = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);
  return {
    iv: iv.toString("hex"),
    encripted: passwordEncripted.toString("hex"),
  };
};

//Metodo de Desemcriptacion
const hackear = (password) => {
  let iv = Buffer.from(password.iv, "hex");
  let valor = Buffer.from(password.encripted, "hex");
  let decipher = crypto.createDecipheriv(algoritmo, Buffer.from(key), iv);

  return Buffer.concat([
    decipher.update(valor),
    decipher.final(),
  ]).toString();;
};

//Password
const password = "Pablo";
const passEncripted = encriptar(password);

console.log(passEncripted)
console.log(hackear(passEncripted));
