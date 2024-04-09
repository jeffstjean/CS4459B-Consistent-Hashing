// SmallCircle.js
import React from 'react';

function SmallCircle({ x, y, type, setHoveredServerID, serverID }) {
    const color = type === 'server' ? 'red' : 'blue';

    return (
        <circle
            cx={x}
            cy={y}
            r="10"
            fill={color}
            onMouseEnter={() => setHoveredServerID(serverID)}
            onMouseLeave={() => setHoveredServerID(null)}
        />
    );
}
export default SmallCircle;
