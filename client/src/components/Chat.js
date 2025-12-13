import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import './Chat.css';

export const Chat = () => {
  const { messages, sendMessage, socket, roomData } = useSocket();
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const getPlayerPhoto = (senderId, senderName) => {
    const player = roomData?.players.find(p => p.id === senderId);
    if (player && player.photoUrl) {
      return player.photoUrl;
    }
    return `https://robohash.org/${senderName}?set=set1`;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className={`chat-container ${isChatOpen ? 'open' : 'closed'}`}>
      <button className="chat-toggle-button" onClick={() => setIsChatOpen(!isChatOpen)}>
        {isChatOpen ? 'Fermer' : 'Ouvrir'} le Chat
      </button>
      {isChatOpen && (
        <>
          <div className="messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-item ${
                  msg.type === 'system'
                    ? 'system-message'
                    : msg.senderId === socket?.id
                    ? 'my-message'
                    : 'other-message'
                }`}
              >
                {msg.type !== 'system' && (
                    <img src={getPlayerPhoto(msg.senderId, msg.senderName)} alt={msg.senderName} className="player-photo" />
                )}
                <div className="message-content">
                    {msg.type !== 'system' && (
                    <div className="message-sender">{msg.senderName}</div>
                    )}
                    <div className="message-text">{msg.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              Envoyer
            </button>
          </form>
        </>
      )}
    </div>
  );
};
