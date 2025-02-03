<script setup lang="ts">
import { io } from "socket.io-client";
import { computed, ref, type Ref } from "vue";
import board from "./Board.vue"

type Player = { id: string; name: string; symbol?: "X" | "O"; room?: string };
type Room = { id: string; players: Player[]; state: ("X" | "O" | null)[]; status: string; currentTurn: "X" | "O" };

const socket = io("http://127.0.0.1:3000");

const rooms: Ref<Room[]> = ref([]);
const players: Ref<Player[]> = ref([]);
const you = computed(() => players.value.find(p => p.id === socket.id));
const currentRoom = computed(() => rooms.value.find(r => r.players.some(p => p.id === socket.id)));

socket.emit("rooms/list", (response: Room[]) => (rooms.value = response));

socket.on("rooms/update", (updatedRooms: Room[]) => (rooms.value = updatedRooms));
socket.on("players/update", (updatedPlayers: Player[]) => (players.value = updatedPlayers));

function createRoom() {
  socket.emit("rooms/create");
}

function joinRoom(roomId: string) {
  socket.emit("rooms/join", roomId);
}

function leaveRoom() {
  socket.emit("rooms/leave");
}

function makeMove(index: number) {
  if (currentRoom.value && you.value?.symbol === currentRoom.value.currentTurn) {
    socket.emit("game/move", { roomId: currentRoom.value.id, index });
  }
}
</script>

<template>
  <div>
    <h1>Multiplayer Tic-Tac-Toe</h1>

    <div>
      <h2>All Players</h2>
      <ul>
        <li v-for="player in players" :key="player.id">
          {{ player.name }}{{ player.id === you?.id ? " (You)" : "" }}
        </li>
      </ul>
    </div>

    <div>
      <h2>Rooms</h2>
      <button v-if="!currentRoom" @click="createRoom">Create Room</button>
      <ul>
        <li v-for="room in rooms" :key="room.id">
          {{ room.id }} ({{ room.players.length }}/2)
          <button v-if="!currentRoom && room.players.length < 2" @click="joinRoom(room.id)">Join</button>
        </li>
      </ul>
    </div>

    <div v-if="currentRoom">
      <h2>Room: {{ currentRoom.id }}</h2>
      <p>Players: {{ currentRoom.players.map(p => p.name).join(", ") }}</p>
      <p>Status: {{ currentRoom.status }}</p>
      <button @click="leaveRoom">Leave Room</button>

      <board 
        v-if="currentRoom.status === 'active'" 
        :state="currentRoom.state" 
        @cell-click="makeMove" 
      />
    </div>
  </div>
</template>