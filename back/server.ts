import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import express from 'express'

const app = express()
const server = createServer(app)
const io = new Server(server)

const rooms = ['room1', 'room2', 'room3']
const players = [{name: '!ksunik', id: 0}]

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  io.emit('players/connected', socket.id);
  players.forEach(p => socket.emit('players/connected', { name: p, id: p}))

  socket.on('rooms/list', (callback) => {
    callback({ status: 'ok', rooms });
  })

  socket.on('rooms/create', (room) => {
    io.emit('rooms/create', room)
  });

  socket.on('disconnect', () => {
    io.emit('players/disconnected', socket.id);
  })
});

server.listen(3000, () => {
  console.log('Started server on port 3000')
})