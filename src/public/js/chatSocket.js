const chatBox = document.getElementById("chatBox");
const chatSend = document.getElementById("chatSend");
const massajesChat = document.getElementById('massajesChat')
const socket = io();
let user = "";

Swal.fire({
  title: "Usuario",
  input: "text",
  text: "Ingrese un Nombre",
  inputValidator: (data) => {
    return !data && "Ingrese un Nombre Valido";
  },
  allowOutsideClick: false,
}).then((data) => {
  user = data.value;
  console.log(user);
});

chatSend.addEventListener("click", (e) => {
  if (chatBox.value.trim().length > 0)
    socket.emit("massajeChat", {
      user,
      massaje: chatBox.value,
    });
  chatBox.value = "";
});

socket.on("messajeLogs", data => {
    massajesChat.innerHTML = ""
    data.forEach(massaje => {
        massajesChat.innerHTML += `<p>${massaje.user} dice: ${massaje.massaje}</p>`
    });
})