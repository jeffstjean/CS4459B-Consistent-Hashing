import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/message')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("There was an error!", error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Server says: {message}
        </p>
      </header>
    </div>
  );
}

export default App;
