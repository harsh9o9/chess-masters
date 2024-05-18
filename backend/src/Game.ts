import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { SOCKET_EVENTS } from "./constants/messages";
import { emitEvent } from "./utils/socket-helpers";

const CHESS_PIECE_COLORS = Object.freeze({
  WHITE: "white",
  BLACK: "black",
});

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  private moveCount: number;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.moveCount = 0;

    // let the users know game has begun
    emitEvent(this.player1, SOCKET_EVENTS.INIT_GAME, {
      color: CHESS_PIECE_COLORS.WHITE,
    });

    emitEvent(this.player2, SOCKET_EVENTS.INIT_GAME, {
      color: CHESS_PIECE_COLORS.BLACK,
    });
  }

  public makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    // validate moves
    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      emitEvent(this.player2, SOCKET_EVENTS.INVALID_MOVE);
      return;
    }
    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      emitEvent(this.player1, SOCKET_EVENTS.INVALID_MOVE);
      return;
    }
    try {
      this.board.move(move);
    } catch (e) {
      console.log("error move: ", e);

      // error handled by chess library itself
      return;
    }

    if (this.board.isGameOver()) {
      // Send the game over message to the user
      // Send the game over message to both players
      emitEvent(this.player1, SOCKET_EVENTS.GAME_OVER, {
        winner: Game.getCurrentChessPieceColorFromBoard(this.board),
      });
      emitEvent(this.player2, SOCKET_EVENTS.GAME_OVER, {
        winner: Game.getCurrentChessPieceColorFromBoard(this.board),
      });
      return;
    }

    // inform the other player
    if (this.moveCount % 2 === 0) {
      emitEvent(this.player2, SOCKET_EVENTS.MOVE, move);
    } else {
      emitEvent(this.player1, SOCKET_EVENTS.MOVE, move);
    }

    this.moveCount++;
  }

  /**
   * Get the given board current player color (e.g. white or black)
   * @param board board object whose current player color to return
   * @returns {string | undefined}  white or black
   */
  private static getCurrentChessPieceColorFromBoard = (
    board: Chess
  ): string | undefined => {
    if (board) {
      return board.turn() === "w"
        ? CHESS_PIECE_COLORS.BLACK
        : CHESS_PIECE_COLORS.WHITE;
    } else {
      return undefined;
    }
  };
}
