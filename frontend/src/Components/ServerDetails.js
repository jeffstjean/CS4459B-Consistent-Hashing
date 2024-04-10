import React from 'react';

function ServerDetails({ server }) {
    return (
        <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', border: '1px solid black' }}>
            <h3>Server Details</h3>
            <p>Name: {server.name}</p>
            <p>Last Heartbeat: {server.lastHb}</p>
            <p>Port: {server.port}</p>
            <p>Status: {server.status}</p>
            <p>Hash: {server.hash}</p>
            {server.data && (
                <div>
                    <h4>Keys:</h4>
                    <ul>
                        {server.data.map((item, index) => (
                            <li key={index}>
                                Key: {item.key}, Value: {item.value}, Hash: {item.hash}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
export default ServerDetails;
