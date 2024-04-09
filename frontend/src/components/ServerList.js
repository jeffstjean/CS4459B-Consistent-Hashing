// ServerList.js
import React from 'react';
import Node from './Node';

function ServerList({ servers, addServer, deleteServer }) {
  return (
    <div className="server-list">
      <h2>Server List</h2>
      <button onClick={addServer}>Add Node</button>
      {servers.map((server) => (
        <Node key={server.id} server={server} onDelete={() => deleteServer(server.id)} />
      ))}
    </div>
  );
}

export default ServerList;
