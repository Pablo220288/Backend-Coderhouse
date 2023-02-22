const userName = document.getElementById("userName");
const userTiping = document.getElementById("userTiping");
const chatBox = document.getElementById("chatBox");
const chatSend = document.getElementById("chatSend");
const messajesChat = document.getElementById("messajesChat");
const usersConnection = document.getElementById("usersConnection");
const socket = io();

let user = "";
let usersCaht = [];

const date = () => {
  let timeNow = new Date();
  return timeNow.getHours() + ":" + timeNow.getMinutes();
};

Swal.fire({
  title: "Usuario",
  input: "text",
  text: "Ingrese un Nombre",
  inputValidator: (data) => {
    return !data && "Ingrese un Nombre Valido";
  },
  allowOutsideClick: false,
}).then((data) => {
  let nombre = data.value.replace(/(^\w{1})|(\s+\w{1})/g, (letra) =>
    letra.toUpperCase()
  );
  user = nombre;
  userName.textContent = user;
  messajesChat.scrollTop = messajesChat.scrollHeight;
  let time = date();
  socket.emit("userChat", {
    user,
    messaje: `se ha conectado`,
    time,
    id: socket.id,
  });
});

const messajeChatInner = (data) => {
  let msgAll = "";
  let classMsg = "";
  let moreMsg = "";
  for (let i = 0; i < data.length; i++) {
    if (data[i].idConnection === "Connection") {
      classMsg = "connection";
    } else if (socket.id != data[i].id) {
      classMsg = "";
    } else {
      classMsg = "myMsg";
    }

    if (data[i - 1] == undefined) {
      moreMsg = "";
    } else if (data[i - 1].idConnection === "Connection") {
      moreMsg = "";
    } else if (data[i].id === data[i - 1].id) {
      moreMsg = "moreMsg";
    } else {
      moreMsg = "";
    }

    msgAll += `
    <div class="chat_container ${classMsg} ${moreMsg}">
    <strong class="chat_title">${data[i].user}</strong>
    <p class="chat_txt">${data[i].messaje}</p>
    <span class="chat_hs">${data[i].time}</span>
    </div>
    `;
  }
  return msgAll;
};
const userChatInner = (data) => {
  let userAll = "";
  let classUser = "";
  for (let i = 0; i < data.length; i++) {
    if (socket.id != data[i].id) {
      classUser = "otherUser";
    } else {
      classUser = "myUser";
    }
    userAll += `<p class="${classUser}">${data[i].user}</p>`;
  }
  return userAll;
};

socket.on("userChat", (users, messajes) => {
  usersConnection.innerHTML = "";
  messajesChat.innerHTML = "";
  let userAll = userChatInner(users);
  let msgAll = messajeChatInner(messajes);
  usersConnection.innerHTML = userAll;
  messajesChat.innerHTML = msgAll;
});

chatSend.addEventListener("click", (e) => {
  let timeNow = new Date();
  let time = timeNow.getHours() + ":" + timeNow.getMinutes();
  if (chatBox.value.trim().length > 0)
    socket.emit("messajeChat", {
      user,
      messaje: chatBox.value,
      time,
      id: socket.id,
    });
  chatBox.value = "";
});

chatBox.addEventListener("keypress", () => {
  socket.emit("typing", { user });
});

socket.on("messajeLogs", (data) => {
  userTiping.textContent = "";
  messajesChat.innerHTML = "";
  let msgAll = messajeChatInner(data);
  messajesChat.innerHTML = msgAll;
  messajesChat.scrollTop = messajesChat.scrollHeight;
  console.log(data);
});

socket.on("typing", (data) => {
  userTiping.textContent = `${data.user} escribiendo...`;
});
