import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import petname from "node-petname";

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST"], allowedHeaders: ["*"] }));

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

type Player = { id: string; name: string; symbol?: "X" | "O"; room?: string };
type RoomState = ("X" | "O" | null)[];
type RoomStatus = "preparing" | "active" | "finished";

type Room = {
  id: string;
  players: Player[];
  state: RoomState;
  status: RoomStatus;
  currentTurn: "X" | "O";
};

const rooms: Room[] = [];
let players: Player[] = [];

function init(socket) {
  const player = { id: socket.id, name: petname(2) };
  players.push(player);
  io.emit("players/update", players);
  io.emit("rooms/update", rooms);
}

io.on("connection", (socket) => {
  init(socket);

  socket.on("players/rename", (newName) => {
    console.log(newName);
    const player = players.find(p => p.id === socket.id);
    if (player) player.name = newName;
    io.emit("players/update", players);
  })

  socket.on("rooms/create", () => {
    const player = players.find(p => p.id === socket.id);
    if (!player || player.room) return;
  
    const room: Room = {
      id: `${player.name}'s Room`,
      players: [player],
      state: Array(9).fill(null),
      status: "preparing",
      currentTurn: "X"
    };
  
    player.room = room.id;
    rooms.push(room);
    io.emit("rooms/update", rooms);
    io.emit("players/update", players);
  });

  socket.on("rooms/join", (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    const player = players.find(p => p.id === socket.id);

    if (!room || !player || room.status === 'finished') return;
    if (player.room || room.players.length >= 2) return;

    player.room = roomId;
    room.players.push(player);

    if (room.players.length === 2) {
      room.status = "active";
      const player1 = players.find(p => p.id === room.players[0].id); 
      const player2 = players.find(p => p.id === room.players[1].id); 
      if (player1 && player2) {
        player1.symbol = 'X';
        player2.symbol = 'O';
      }
      // TODO Assign symbols to both players.
    }
    io.emit("rooms/update", rooms);
    io.emit("players/update", players);
  });

  socket.on("rooms/leave", () => {
    const player = players.find(p => p.id === socket.id);
    if (!player || !player.room) return;

    const room = rooms.find(r => r.id === player.room);
    if (room) {
      room.players = room.players.filter(p => p.id !== player.id);
      if (room.players.length === 0) {
        rooms.splice(rooms.indexOf(room), 1);
      } else {
        if (room.status === 'active') room.status = "preparing";
      }
    }

    player.room = undefined;
    io.emit("rooms/update", rooms);
    io.emit("players/update", players);
  });

  socket.on("game/move", ({ id, cell }) => {
    const room = rooms.find(r => r.id === id);
    const player = players.find(p => p.id === socket.id);

    if (!room || !player || room.status !== "active" || player.symbol !== room.currentTurn || room.state[cell] !== null) return;

    room.state[cell] = player.symbol;
    room.currentTurn = room.currentTurn === "X" ? "O" : "X";

    if (checkWinner(room.state)) room.status = "finished";
    io.emit("rooms/update", rooms);
  });

  socket.on("disconnect", () => {
    const player = players.find(p => p.id === socket.id);
    if (player) {
      if (player.room) {
        const room = rooms.find(r => r.id === player.room);
        if (room) {
          room.players = room.players.filter(p => p.id !== player.id);
          if (room.players.length === 0) {
            rooms.splice(rooms.indexOf(room), 1);
          } else {
            room.status = "preparing";
          }
        }
      }
      players = players.filter(p => p.id !== socket.id);
      io.emit("rooms/update", rooms);
      io.emit("players/update", players);
    }
  });
});

server.listen(3000, () => console.log("✅ Server started on http://127.0.0.1:3000"));

function checkWinner(state: RoomState): boolean {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return lines.some(([a,b,c]) => state[a] && state[a] === state[b] && state[a] === state[c]);
}