import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, message, onConfirm, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="confirmation-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-modal-footer">
          <button onClick={onConfirm} className="confirm-button">Accepter</button>
          <button onClick={onClose} className="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
