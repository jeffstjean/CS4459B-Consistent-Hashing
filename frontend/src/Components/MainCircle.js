// MainCircle.js
import React from 'react';

function MainCircle({ cx, cy, radius }) {
    return (
        <circle cx={cx} cy={cy} r={radius} stroke="black" strokeWidth="2" fill="transparent" />
    );
}
export default MainCircle;
