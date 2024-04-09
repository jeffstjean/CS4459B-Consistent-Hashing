// App.js
import React, { useState } from 'react';
import './App.css';
import SidePane from './components/SidePane';

function App() {
  const [data, setData] = useState([]);

  const handleAddData = (inputValue) => {
    setData([...data, inputValue]);
  };

  return (
    <div className="app">
      <SidePane onAddData={handleAddData} />
      <div className="main-content">
        <h2>Data Display</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
