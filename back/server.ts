import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import petname from "node-petname";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["*"]
}));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"]
  }
});

type Player = { id: string; name: string; };
type RoomState = boolean[][];
type RoomStatus = "preparing" | "active" | "finished";

type Room = {
  id: string;
  creator: Player;
  players: Player[];
  state: RoomState;
  status: RoomStatus;
};

const rooms: Room[] = [];
let players: Player[] = [];

function init(socket) {
  const player = { id: socket.id, name: petname(2) };
  players.forEach((p) => socket.emit("players/connected", p));
  socket.emit("players/connected/you", player);
  io.emit("players/connected", player);
  players.push(player);
}

io.on("connection", (socket) => {
  init(socket);

  socket.on("rooms/list", (callback) => callback(rooms));

  socket.on("rooms/create", (room) => {
    io.emit("rooms/create", room);
  });

  socket.on("disconnect", () => {
    io.emit("players/disconnected", socket.id);
    players = players.filter((p) => p.id != socket.id);
  });

  socket.on("players/rename", (updated: Player) => {
    players = players.map(p => p.id === updated.id ? updated : p)
    io.emit("players/rename", updated);
  });
});

server.listen(3000, () => {
  console.log("✅ Server started on http://127.0.0.1:3000");
});