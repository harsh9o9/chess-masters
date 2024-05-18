import { WebSocket } from "ws";
import { Game } from "./Game";
import { SOCKET_EVENTS } from "./constants/messages";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    // stop the game here as user left
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === SOCKET_EVENTS.INIT_GAME) {
        if (this.pendingUser) {
          //start a game
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }

      if (message.type === SOCKET_EVENTS.MOVE) {
        // 1. Find the game this player is playing.
        const currentGame = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (currentGame) {
          currentGame.makeMove(socket, message.payload.move);
        }
      }
    });
  }

  private handleMessage() {}
}
