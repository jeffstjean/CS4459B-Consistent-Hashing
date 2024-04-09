// DataInput.js
import React, { useState } from 'react';

function DataInput({ addData }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addData(inputValue);
    setInputValue('');
  };

  return (
    <div className="data-input">
      <h2>Data Input</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleChange} placeholder="Enter data" />
        <button type="submit">Add Data</button>
      </form>
    </div>
  );
}

export default DataInput;
