## Multiplayer Tic-Tac-Toe powered by the socket.io

- Communication via WS only.
- Clients are only allowed to tell the server about the concrete actions (players/rename, rooms/create, rooms/join, game/move).
- Server tells the client the whole state at once (players/update, rooms/update). 
- All the validity checks are performed by the server. 
- State is kept in the memory, no DB's.
- Automatically generates funny names.


*\* And just appreciate the OG look!*
 ![](./Screenshot%202025-02-07%20at%2020.49.11.png)

 ### How to run this game

- Server
 ```
 $ cd back
 $ npm run dev
 ```

- Front
 ```
 $ cd front
 $ npm run dev
 ```
 
