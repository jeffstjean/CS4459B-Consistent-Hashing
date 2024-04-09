// SidePane.js
import React, { useState } from 'react';
import './SidePane.css';

function SidePane({ onAddData }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // Trigger onAddData callback with inputValue
    onAddData(inputValue);
    // Clear input field after adding data
    setInputValue('');
  };

  return (
    <div className="side-pane">
      <h2>Data Input</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter data..."
      />
      <button onClick={handleSubmit}>Add Data</button>
    </div>
  );
}

export default SidePane;
