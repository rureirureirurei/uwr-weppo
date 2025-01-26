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
