import * as http from "http";

const server = http.createServer((request, response) => {
  response.end("Hola Mundo. Bienvenidos a mi Proyecto Backend");
});

server.listen(8080, () => {
  console.log("listening on port 8080");
});
