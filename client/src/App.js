import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { SocketProvider, SocketContext } from './contexts/SocketContext';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { Game } from './pages/Game';
import PenaltyModal from './components/PenaltyModal';
import './App.css';

function AppContent() {
  const { penalty, closePenaltyModal, isChatVisible, toggleChatVisibility, currentRoom } = useContext(SocketContext);
  const [searchParams] = useSearchParams();
  const joinCode = searchParams.get('joinCode');

  return (
    <>
      <Routes>
        <Route path="/" element={<Home joinCode={joinCode} />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <PenaltyModal penalties={penalty} onClose={closePenaltyModal} />
      {currentRoom && (
        <button onClick={toggleChatVisibility} className="chat-visibility-toggle">
          <img src={`/assets/${isChatVisible ? 'Eye-Open' : 'Eye-Slash'}.png`} alt="Toggle Chat" />
        </button>
      )}
    </>
  );
}

function App() {
  return (
    <SocketProvider>
      <Router>
        <AppContent />
      </Router>
    </SocketProvider>
  );
}

export default App;
