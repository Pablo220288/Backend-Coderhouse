const userName = document.getElementById("userName");
const userTiping = document.getElementById("userTiping");
const chatBox = document.getElementById("chatBox");
const chatSend = document.getElementById("chatSend");
const messajesChat = document.getElementById("messajesChat");
const usersConnection = document.getElementById("usersConnection");
const socket = io();

let user = "";

const dateShort = () => {
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
  socket.emit("userChat", {
    user,
    messaje: `se ha conectado`,
    time: dateShort(),
    id: socket.id,
  });
});

const messajeChatInner = (data) => {
  let msgAll = "";
  let classMsg = "";
  let moreMsg = "";
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].idConnection === "Connection" ||
      data[i].idConnection === "disConnection"
    ) {
      classMsg = "connection";
    } else if (socket.id != data[i].idUser) {
      classMsg = "";
    } else {
      classMsg = "myMsg";
    }

    if (data[i - 1] == undefined) {
      moreMsg = "";
    } else if (data[i - 1].idConnection === "Connection") {
      moreMsg = "";
    } else if (data[i].idUser === data[i - 1].idUser) {
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
    if (socket.id != data[i].idUser) {
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
  messajesChat.scrollTop = messajesChat.scrollHeight;
});

chatSend.addEventListener("click", (e) => {
  if (chatBox.value.trim().length > 0)
    socket.emit("messajeChat", {
      user,
      messaje: chatBox.value,
      time: dateShort(),
      idUser: socket.id,
    });
  chatBox.value = "";
});

chatBox.addEventListener("keypress", () => {
  socket.emit("typing", { user });
});

socket.on("messajeLogs", (data) => {
  console.log(data);
  userTiping.textContent = "";
  messajesChat.innerHTML = "";
  let msgAll = messajeChatInner(data);
  messajesChat.innerHTML = msgAll;
  messajesChat.scrollTop = messajesChat.scrollHeight;
});

socket.on("typing", (data) => {
  userTiping.textContent = `${data.user} escribiendo...`;
});

socket.on("userDisconnect", (data) => {
  messajesChat.innerHTML = "";
  let msgAll = messajeChatInner(data);
  messajesChat.innerHTML = msgAll;
  messajesChat.scrollTop = messajesChat.scrollHeight;
});
