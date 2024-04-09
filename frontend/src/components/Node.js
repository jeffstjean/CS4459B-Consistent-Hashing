// Node.js
import React from 'react';

function Node({ server, onDelete }) {
  return (
    <div className="node">
      <span>Server {server.id}</span>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default Node;
