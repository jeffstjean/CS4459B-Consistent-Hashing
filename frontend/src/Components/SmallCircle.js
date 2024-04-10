import React from 'react';

function SmallCircle({ x, y, type, setHoveredServerID, serverID }) {
    const color = type === 'server' ? 'red' : 'blue';
    const handleMouseEnter = () => {
        if (type === 'server') {
            setHoveredServerID(serverID);
        }
    };
    const handleMouseLeave = () => {
        if (type === 'server') {
            setHoveredServerID(null);
        }
    };

    return (
        <circle
            cx={x}
            cy={y}
            r="10"
            fill={color}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
}
export default SmallCircle;
