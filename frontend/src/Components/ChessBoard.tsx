import { Chess, Color, PieceSymbol, Square } from 'chess.js';
import { useEffect, useState } from 'react';
import { SOCKET_EVENTS } from '../constants/messages';

const CHESS_PIECES = Object.freeze({
  COLOR: {
    BLACK: 'b',
    WHITE: 'w',
  },
  COLUMNS: 'abcdefgh'.split(''),
});

const DATA_SQUARE = 'data-square';

export const ChessBoard = ({
  chess,
  board,
  setBoard,
  socket,
}: {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  setBoard: any;
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  useEffect(() => {}, [board]);

  const onChessItemClick = (evt: React.SyntheticEvent<EventTarget>) => {
    const currentPosition: Square | null = getChessPiecePostionFromEvent(evt);

    if (!currentPosition) {
      setFrom(null);
      setBoard(chess.board());
      return;
    }

    if (currentPosition) {
      if (!from) {
        setFrom(currentPosition);
      } else {
        const move = {
          from,
          to: currentPosition,
        };
        socket.send(
          JSON.stringify({
            type: SOCKET_EVENTS.MOVE,
            payload: {
              move,
            },
          })
        );
        setFrom(null);
        chess.move(move);
        setBoard(chess.board());
      }
    }
  };

  /**
   * Helper method to ger chess piece position from given event object square data attribute.
   * @param evt evt from clicking square tile in chessboard
   * @returns square position e.g. e7, b2, c5, etc.
   */
  const getChessPiecePostionFromEvent = (evt: React.SyntheticEvent<EventTarget>): Square | null => {
    if (evt?.target instanceof HTMLDivElement && evt?.target?.getAttribute(DATA_SQUARE)) {
      return evt?.target?.getAttribute(DATA_SQUARE) as Square;
    } else if (evt?.target instanceof HTMLImageElement && evt?.target?.parentElement?.getAttribute(DATA_SQUARE)) {
      return evt?.target?.parentElement?.getAttribute(DATA_SQUARE) as Square;
    }
    return null;
  };

  /**
   * Helper method to get chess piece png path
   * @param chessPiecetype type of piece like b, k, q, etc.
   * @param chessPieceColor color of piece e.g. w, b
   * @returns path string like k-w.png, q-b.png
   */
  const getChessPieceImgPath = (chessPiecetype: PieceSymbol, chessPieceColor: Color): string => {
    return `/${chessPiecetype}-${chessPieceColor}.png`;
  };

  return (
    <div className="shadow-1 inline-grid aspect-square grid-cols-8 grid-rows-8">
      {board
        .flatMap((row, i) => row.map((value, j) => ({ i, j, value })))
        .map((squareData) => {
          return (
            <div
              key={`${squareData.i}${squareData.j}`}
              className={`${squareData.i}${squareData.j} inline-flex aspect-square items-center justify-center overflow-hidden p-1 ${(squareData.i + squareData.j) % 2 === 0 ? 'bg-blue-300' : 'bg-blue-500'} ${squareData.value?.color === CHESS_PIECES.COLOR.BLACK ? 'text-black' : 'text-white'} font-bold`}
              data-square={`${CHESS_PIECES.COLUMNS[squareData.j]}${8 - squareData.i}`}
              onClick={onChessItemClick}
            >
              {squareData.value ? (
                <img src={getChessPieceImgPath(squareData.value.type, squareData.value.color)} />
              ) : (
                ''
              )}
            </div>
          );
        })}
    </div>
  );
};
