import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import express from 'express';
import petname from 'node-petname';

const app = express()
const server = createServer(app)
const io = new Server(server)

type Player = {
  name: string,
  id: string,
}

const rooms = ['room1', 'room2', 'room3']
let players: Player[] = []//[{ name: 'Ksu', id: '0' }]

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

function init(socket) {
  const player = { id: socket.id, name: petname(2) };
  players.forEach(p => socket.emit('players/connected', p));
  io.emit('players/connected', player)
  players.push(player);
}

io.on('connection', (socket) => {

  console.log('Connection')

  init(socket);

  socket.on('rooms/list', (callback) => {
    callback({ status: 'ok', rooms });
  })

  socket.on('rooms/create', (room) => {
    io.emit('rooms/create', room)
  });

  socket.on('disconnect', () => {
    io.emit('players/disconnected', socket.id);
    players = players.filter(p => p.id != socket.id);
  })
});

server.listen(3000, () => {
  console.log('Started server on port 3000')
})