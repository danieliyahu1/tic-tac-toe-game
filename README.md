# Tic-Tac-Toe Game

## Overview
This project is a real-time, multiplayer Tic-Tac-Toe game where two players compete against each other in a classic game of Tic-Tac-Toe. The game is built using modern web technologies and allows users to connect online, enter their names, find an opponent, and play the game in real-time with updates pushed instantly to both players' screens.

## Features
- **Real-time Multiplayer:** Two players can connect from different devices and play against each other.
- **Responsive Design:** The game is fully responsive and works across different devices (PC, tablet, smartphone).
- **Player Matching:** Enter your name and find a random opponent to play against.
- **Game Logic:** Automatically handles turns, tracks the game state, and detects wins or draws.
- **Loading Indicator:** Shows a loading spinner while searching for an opponent.

## Demo
https://tic-tac-toe-game-z084.onrender.com

## Technologies Used

### Frontend:
- **React.js:** For building the user interface.
- **TypeScript:** To provide static type checking and improve code quality.
- **Socket.IO Client:** To handle real-time communication between players.
- **Tailwind CSS:** For styling the application with a utility-first CSS framework.
- **Vite:** A fast development build tool for React and TypeScript.

### Backend:
- **Node.js & Express:** The backend server to handle player matching and game state management.
- **Socket.IO Server:** To enable real-time, bidirectional communication between the players and the server.
- **MongoDB (optional):** Used if you want to persist game data or player information.

## How to Play
1. Enter your name and click "Search for a player."
2. Wait for the game to find an opponent.
3. Once connected, your opponent's name will appear, and you'll be assigned either "X" or "O."
4. Take turns placing your marks on the board. The game will notify you whose turn it is.
5. The game ends when one player wins or if the game results in a draw. An alert will notify both players, and the game will reset.
