import { WebSocket } from "ws";
import { SOCKET_EVENTS } from "../constants/messages";

export const emitEvent = (
  to: WebSocket,
  eventType: "init_game" | "move" | "game_over" | "invalid_move",
  payload?: object
) => {
  if (to && Object.values(SOCKET_EVENTS).includes(eventType)) {
    to.send(
      JSON.stringify({
        type: eventType,
        payload: payload ? payload : {},
      })
    );
  }
};
