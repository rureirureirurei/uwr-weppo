(25p) (Social Gaming Platform) (More challenges on the client side) 

The task is to create a website that utilizes the capabilities of the `socket.io` library, allowing users to play a simple selected game (at least two-player, such as Tic-Tac-Toe, Checkers, Reversi, Mill, etc.) through their browsers. To store the state of the game itself, one of the following models should be used:

1. Trusted Client:
   - The server trusts the information exchanged between users and does not analyze its content. In particular, for example, it does not validate the correctness of moves made in a board game. 
   - In this approach, each message exchanged between users contains only the necessary information to transfer the game state from one user to another. However, this opens up the possibility of cheating if one of the users modifies/falsifies the data being transmitted to others.

2. Untrusted Client:
   - The server does not trust the information exchanged between users and verifies its correctness. 
   - Typically, the server also maintains the entire game state in its memory. If it determines that the information provided by a user conflicts with the server's knowledge of the game's state (e.g., a user makes an invalid move), the server treats this as a rule violation and blocks/modifies such incorrect communication.

Functional Requirements:
1. Anonymous User (No Login Required):
   - Ability to set a custom identifier (nickname).
   - View a list of "rooms" where games are currently taking place.
   - Create a new game room.
   - Join a room where someone is waiting for a game.
   - Play a complete game session of the chosen game.

2. (Optional) Registered User:
   - Create a new account (provide username/password).
   - Log in to the account.
   - View statistics of completed games.

-------------

Room 
   Id      : String
   State   : enum of Preparing, Started, Finished
   Players : List [ Player ]
   State   : State 

Player : 
   Name : String
   Id   : String 

State  : Bool [][]

-----

Server - ts + express + socket.io 
All the endpoints are implemented using the socket.io 

The web app has 
- notifiers that are explicitly called by the client in order to notify the server - the handler implementation is in server
   user/change-name
   user/create-room
   user/leave-room
- builtin notifiers - the handler implementation is in server
   connected
   disconnected

- subscription getters   (when other player does something and the server wants to notify the other players ) 
  the server should proxy such requests (possibly parsing something) the clients should implement the handling
   user/joined
   user/disconnected
   room/created
   room/removed
      
- more rest-like request response thingies ( initial data load whenever the player joins, or room create )
   rooms/get-list
   user/get-list
- the game actions 
   room/started
   room/finished
   room/move
   
Front - spa in vue 

Pages : 

/ (the main page - list of rooms, list of players , Change nickname, Create room button)
/room/x
on the left - the game plane , on the right - list of players in the room
