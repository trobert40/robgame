import React from 'react';
import './PenaltyModal.css';

const PenaltyModal = ({ penalties, onClose }) => {
  if (!penalties || penalties.length === 0) {
    return null;
  }

  const totalDrinks = penalties
    .filter(p => p.type === 'drink')
    .reduce((sum, p) => sum + p.amount, 0);

  const distributionPenalties = penalties.filter(p => p.type === 'distribute');

  return (
    <div className="penalty-modal-overlay">
      <div className="penalty-modal">
        <div className="penalty-modal-header">
          <h2>Pénalité !</h2>
        </div>
        <div className="penalty-modal-body">
          {totalDrinks > 0 && (
            <p>Tu bois {totalDrinks} gorgée{totalDrinks > 1 ? 's' : ''}.</p>
          )}
          {distributionPenalties.length > 0 && (
            <div>
              <p>Tu distribues :</p>
              <ul>
                {distributionPenalties.map((p, index) => (
                  <li key={index}>
                    {p.amount} gorgée{p.amount > 1 ? 's' : ''} (cheval {p.horse})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="penalty-modal-footer">
          <button onClick={onClose} className="penalty-modal-close-btn">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default PenaltyModal;
