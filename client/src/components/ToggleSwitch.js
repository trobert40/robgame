import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ id, checked, onChange, label }) => {
  return (
    <div className="toggle-switch-container">
      <label htmlFor={id} className="toggle-switch-label">{label}</label>
      <div className="toggle-switch">
        <input
          type="checkbox"
          className="toggle-switch-checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
        />
        <label className="toggle-switch-slider" htmlFor={id}></label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
