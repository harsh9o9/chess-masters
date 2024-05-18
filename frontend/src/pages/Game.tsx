import { Chess } from 'chess.js';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../Components/Button';
import { ChessBoard } from '../Components/ChessBoard';
import { useSocket } from '../Hooks/useSocket';
import { SOCKET_EVENTS } from '../constants/messages';
import { PageLayout } from '../layout/PageLayout';

export const Game = () => {
  const socket = useSocket();
  const chess = useRef(new Chess());
  const [board, setBoard] = useState(chess.current.board());
  const [playerColor, setPlayerColor] = useState<null | string>(null);
  const [isPendingPlayRequest, setIsPendingPlayRequest] = useState<null | boolean>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (evt: MessageEvent) => {
      try {
        const message = JSON.parse(evt?.data);

        switch (message?.type) {
          case SOCKET_EVENTS.INIT_GAME:
            setIsPendingPlayRequest(false);
            setBoard(chess.current.board());
            if (message?.payload?.color) {
              setPlayerColor(message?.payload?.color);
            }
            break;
          case SOCKET_EVENTS.MOVE:
            if (message?.payload) {
              chess.current.move(message?.payload);
              setBoard(chess.current.board());
            }
            break;
          case SOCKET_EVENTS.INVALID_MOVE:
            chess.current.undo();
            setBoard(chess.current.board());
            break;
          case SOCKET_EVENTS.GAME_OVER:
            if (message?.payload && message?.payload?.winner) {
              alert(`Game Over, winner is: ${message?.payload?.winner}`);
              break;
            }
            alert('Game Over');
            break;
        }
      } catch (e) {
        console.error('There is an exception while parsing the json: ', e);
      }
    };
  }, [socket, chess, board]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <PageLayout>
      <div className="grid w-full max-w-screen-lg grid-cols-1 grid-rows-6 rounded bg-blue-400 p-1 shadow-lg md:grid-cols-6 md:grid-rows-1 md:p-8">
        <div className="row-span-4 aspect-square place-self-center bg-slate-500 md:col-span-4 md:row-auto">
          <ChessBoard chess={chess.current} board={board} setBoard={setBoard} socket={socket} />
        </div>
        <div className="row-span-2 flex justify-center bg-blue-500 shadow-lg md:col-span-2 md:row-auto ">
          <div className="mt-12">
            {isPendingPlayRequest || playerColor ? (
              <p
                className={`text-xl font-bold ${isPendingPlayRequest ? 'text-green-400' : playerColor === 'white' ? 'text-white' : 'text-black'}`}
              >
                {isPendingPlayRequest ? 'Connecting...' : `You are ${playerColor}`}
              </p>
            ) : (
              <Button
                onClick={() => {
                  setIsPendingPlayRequest(true);
                  socket.send(
                    JSON.stringify({
                      type: SOCKET_EVENTS.INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </Button>
              // <></>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
