<script setup lang="ts">
import { io } from "socket.io-client";
import { computed, ref, type Ref } from "vue";

type Player = { id: string; name: string };
type Room = { id: string; name: string };

// ✅ FIXED: Explicit URL with protocol
const socket = io("http://127.0.0.1:3000");

const rooms: Ref<Room[]> = ref([]);
const players: Ref<Player[]> = ref([]);
const you = computed(() => players.value.find(p => p.id === socket.id));

/** Updates the Player in the list (or adds if missing) */
function setP(updated: Player) {
  if (!players.value.find(p => p.id == updated.id)) {
    players.value.push(updated)
  } else {
    players.value = players.value.map(p => p.id === updated.id ? updated : p);
  }
}

socket.emit("rooms/list", (response: Room[]) => rooms.value.push(...response));

socket.on("rooms/create", (room: Room) => rooms.value.push(room));

socket.on("players/connected",     setP);
socket.on("players/rename",        setP)
socket.on("players/connected/you", setP);

socket.on("players/disconnected", (playerid: string) =>
  (players.value = players.value.filter((r) => r.id !== playerid))
);


function rename(name: string) {
  if (!you.value) return;
  you.value.name = name;
  socket.emit("players/rename", you.value)
}
</script>

<template>
  <div> 
    Your nickname is 
    <input @input="(event: any) => rename(event.target?.value)" :placeholder="you?.name"/> 
  </div>
  Players: 
  <li v-for="player in players" :key="player.id">
    {{ player.name + (player.id == you?.id ? ' (You)' : '')}}
  </li>
  <div v-for="room in rooms" :key="room.id">
    {{ room.name }}
  </div>
</template>