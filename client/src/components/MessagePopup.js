import React from 'react';
import './MessagePopup.css';

export const MessagePopup = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="message-popup-container">
      <p className="message-popup-text">{message.senderName}: {message.text}</p>
    </div>
  );
};
