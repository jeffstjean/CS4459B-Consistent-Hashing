import React, { useState } from 'react';
import './../App.css';

function SmallCircle({ x, y, type, setHoveredServerID, serverID, isHighlighted, port, keyValue }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        if (type === 'server') {
            setIsHovered(true);
            setHoveredServerID(serverID);
        }
    };

    const handleMouseLeave = () => {
        if (type === 'server') {
            setIsHovered(false);
            setHoveredServerID(null);
        }
    };

    // Adjust initial and highlight behavior
    const initialRadius = type === 'key' ? 10 : 15;
    const highlightedRadiusIncrease = type === 'key' ? 2 : 5;
    const radius = isHovered || isHighlighted ? initialRadius + highlightedRadiusIncrease : initialRadius;

    // Determine fill and stroke colors
    let fillColor, strokeColor;
    if (type === 'server') {
        fillColor = isHovered ? "#ff5722" : 'red';
        strokeColor = isHovered ? "#ff9800" : "none"; // Define strokeColor based on hover state for server
    } else { // type === 'key'
        fillColor = isHighlighted ? "#add8e6" : 'blue'; // Lighter blue when highlighted
        strokeColor = isHighlighted ? "#007bff" : "none"; // Define strokeColor for keys when highlighted
    }

    return (
        <g>
            <circle
                cx={x}
                cy={y}
                r={radius}
                fill={fillColor}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`circle-base ${isHovered ? 'circle-hovered' : ''} ${isHighlighted ? 'circle-highlighted' : ''}`}
                style={{
                    '--hover-stroke-width': isHovered || isHighlighted ? '2px' : '0',
                    '--stroke-color': strokeColor,
                }}
            />
            {type === 'server' && (
                <>
                    <rect
                        x={x - 20} // Adjust based on the desired size of the background
                        y={y + radius + 10}
                        width="40" // Adjust width as necessary
                        height="20" // Adjust height as necessary
                        className={`text-background ${isHovered ? 'text-background-bold' : ''}`}
                    />
                    <text
                        x={x}
                        y={y + radius + 20} // Adjust for placement under the circle
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        className={`server-id-text ${isHovered ? 'server-id-text-bold' : ''}`}
                    >
                        {port}
                    </text>
                </>
            )}
         {type === 'key' && isHighlighted && (
                <text
                    x={x}
                    y={y + 20} // Position the text below the key circle when highlighted
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="key-text"
                    style={{ fill: 'black', fontSize: '10px' }} // Style the key text
                >
                    {keyValue} {/* Display the key stored */}
                </text>
            )}
        </g>
    );
}
export default SmallCircle;