import { useNavigate } from 'react-router';
import { PageLayout } from '../layout/PageLayout';
import { Button } from '../Components/Button';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="m-2 grid grid-cols-2 rounded bg-blue-400 p-8 shadow-lg">
        <img className="w-[32rem]" src="/chess-board.jpeg" alt="chess board" aria-hidden="true" />
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-2xl font-bold text-blue-950">
            Play Chess Online on the <span className="rounded-full border border-green-300 p-1">#1</span> Site!
          </h1>
          <Button onClick={() => navigate('/game')}>Join Game</Button>
        </div>
      </div>
    </PageLayout>
  );
};
