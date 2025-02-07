Socket events:

Client moves: 
   socket.on("rooms/update", (updatedRooms: Room[])       => (rooms.value = updatedRooms));
   socket.on("players/update", (updatedPlayers: Player[]) => (players.value = updatedPlayers));
   socket.emit("game/move", { roomId: currentRoom.value.id, index });