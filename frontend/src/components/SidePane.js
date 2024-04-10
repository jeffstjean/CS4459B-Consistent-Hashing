// SidePane.js
import React, { useState } from 'react';
import './SidePane.css';

function SidePane({ onAddData, onActivateNode, onDeactivateNode }) {
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

//   const handleAddNode = () => {
//     // Call the parent component's function to add a node
//     onAddNode();
//   };

//   const handleRemoveNode = () => {
//     // Call the parent component's function to remove a node
//     onRemoveNode();
//   };

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
      <div className="button-group">
        <button onClick={onActivateNode}>Add Node</button>
        <button onClick={onDeactivateNode}>Remove Node</button>
      </div>
    </div>
  );
}

export default SidePane;
