<script setup lang="ts">
import { io } from "socket.io-client";
import { computed, ref, type Ref } from "vue";
import board from "./Board.vue"
import { fold } from "./utils.ts"

type Player = { id: string; name: string; symbol?: "X" | "O"; room?: string };
type Room   = { id: string; players: Player[]; state: ("X" | "O" | null)[]; status: string; currentTurn: "X" | "O" };

const socket = io("http://127.0.0.1:3000");

const rooms:   Ref<Room[]>   = ref([]);
const players: Ref<Player[]> = ref([]);

const you         = computed(() => players.value.find(p => p.id === socket.id));
const room = computed(() => rooms.value.find(r => r.players.some(p => p.id === socket.id)));

socket.on("rooms/update",   (updatedRooms: Room[])     => (rooms.value   = updatedRooms));
socket.on("players/update", (updatedPlayers: Player[]) => (players.value = updatedPlayers));


const createRoom = ()             => socket.emit("rooms/create");
const joinRoom   = (id: string)   => socket.emit("rooms/join", id);
const leaveRoom  = ()             => socket.emit("rooms/leave");
const makeMove   = (cell: number) => fold (room.value, (({ id }) => socket.emit("game/move", { id, cell })))
const rename     = ()             => fold (window.prompt('New name'), (n) => socket.emit("players/rename", n))

</script>

<template>
  <div>
    <h1>Multiplayer Tic-Tac-Toe</h1>

    <div style="display: flex;">
      <div style="width: 50%;">
        <h3>
          All Players 
          <button v-if="you?.id" @click="rename"> Rename </button>
        </h3>
        <ul>
          <li v-for="player in players" :key="player.id">
            {{ player.name }}{{ player.id === you?.id ? " (You)" : "" }}
          </li>
        </ul>
      </div>

      <div style="width: 50%;">
        <h3> 
          All Rooms 
          <button v-if="!room" @click="createRoom"> Create Room </button>
        </h3>
        <ul>
          <li v-for="room_ in rooms" :key="room_.id">
            {{ room_.id }} ({{ room_.players.length }}/2)
            <button v-if="!room && room_.players.length < 2 && room_.status === 'preparing' " @click="joinRoom(room_.id)"> Join </button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="room">
      <h3>You are in the room: {{ room.id }}</h3>
      <p>Players: {{ room.players.map(p => p.name).join(", ") }}</p>
      <p>Status: {{ room.status }}</p>
      <button v-if="room.status !== 'active' || room.players.length < 2" @click="leaveRoom">Leave Room</button>

      <board 
        v-if="room.status !== 'preparing'" 
        :state="room.state" 
        @cell-click="makeMove" 
      />
    </div>
  </div>
</template>