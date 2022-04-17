let socket;
const submitButton = document.getElementById("submit");
const messagesContainer = document.getElementById("messages");
const usersContainer = document.getElementById("users");
let username = "unknown";
let clients;

(() => {
  username = prompt("What's your name?") || username;
  socket = io(window.location.origin, { query: `username=${username}` });
})();

socket.on("chat message", ({ message, username }) => {
  addMessage(message, username);
});

socket.on("connected", (connectedUsers) => {
  clients = connectedUsers;
  addUsers();
});

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  let userInput = document.getElementById("input");
  socket.emit("chat message", { message: userInput.value, username });
  addMessage(userInput.value, "You");
  userInput.value = "";
});

function addMessage(message, username) {
  const messageElement = document.createElement("p");
  messageElement.innerText = `${username}: ${message}`;
  messagesContainer.append(messageElement);
  messagesContainer.lastChild.scrollIntoView();
}

function addUsers() {
  emptyUsersContainer();
  clients.forEach((client) => {
    const userElement = document.createElement("p");
    userElement.innerText = client;
    userElement.style.marginLeft = "15px"
    usersContainer.append(userElement);
  });
  console.log(usersContainer);
}

function emptyUsersContainer() {
  const users = document.querySelectorAll("#users p");
  users.forEach((user) => {
    user.remove();
  });
}
