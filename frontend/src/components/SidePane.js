// SidePane.js
import React, { useState } from 'react';
import './SidePane.css';

function SidePane({ onAddData }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === '') {
      return; // Do not submit empty value
    }
  
    try {
      const response = await fetch('http://api.example.com/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: inputValue })
      });
  
      if (!response.ok) {
        throw new Error('Failed to add data');
      }
  
      const responseData = await response.json();
  
      // Update parent component's state with hashed value
      onAddData(responseData.hashedData);
  
      // Clear input field after successful submission
      setInputValue('');
    } catch (error) {
      console.error('Error adding data:', error.message);
    }
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
