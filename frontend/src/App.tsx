import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Game } from './pages/Game';
import { Landing } from './pages/Landing';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
