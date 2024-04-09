// ServerDetails.js
import React from 'react';

function ServerDetails({ server }) {
    return (
        <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', border: '1px solid black' }}>
            <h3>Server Details</h3>
            <p>Name: {server.name}</p>
            <p>Last Heartbeat: {server.lastHb}</p>
            <p>Port: {server.port}</p>
            <p>Status: {server.status}</p>
            <p>Degree: {server.degree}</p>
        </div>
    );
}
export default ServerDetails;
