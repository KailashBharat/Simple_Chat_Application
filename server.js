import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

const clients = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

io.on("connection", (socket) => {
  const currentUser = socket.handshake.query?.username;

  clients.push(currentUser);

  console.log("User connected");
  console.log(`Connected clients: ${clients.length}`);

  io.local.emit("connected", clients);

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    const userIndex = clients.findIndex((user) => user == currentUser);
    if (userIndex >= 0) {
      clients.splice(userIndex, 1);
    }
    io.local.emit("connected", clients);
    console.log("User disconnected");
    console.log(`Connected clients: ${clients.length}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
