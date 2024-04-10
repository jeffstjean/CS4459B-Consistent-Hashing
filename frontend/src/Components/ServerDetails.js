import React from 'react';
import './ServerDetails.css';
function ServerDetails({ server }) {
    if (!server) {
        return null;
    }
    return (
        <div className='server-details-pane'>
            <div className='server-details-content'>
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
        </div >
    );
}
export default ServerDetails;
