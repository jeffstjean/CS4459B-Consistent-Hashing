// SmallCircle.js
import React from 'react';

function SmallCircle({ x, y, type }) {
    // Set color and radius based on the type
    const color = type === 'server' ? 'red' : 'blue';
    const radius = type === 'server' ? '10' : '5'; // Example: servers are larger dots

    return (
        <circle cx={x} cy={y} r={radius} fill={color} />
    );
}
export default SmallCircle;
