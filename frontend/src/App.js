// App.js
import React, { useState } from 'react';
import MainCircle from './components/MainCircle';
import SmallCircle from './components/SmallCircle';
import AddNodeForm from './components/AddNodeForm';
import './App.css';
import SidePane from './components/SidePane';

function App() {
    const [dots, setDots] = useState([]);
    const radius = 300;
    const svgSize = 2 * radius + 50;
    const cx = svgSize / 2;
    const cy = svgSize / 2;

    const addServer = (degree) => {
        const radians = degree * (Math.PI / 180);
        const x = cx + radius * Math.cos(radians);
        const y = cy + radius * Math.sin(radians);
        setDots([...dots, { x, y, degree, type: 'server', color: 'red' }]);
    };

    const addKey = (degree) => {
        const radians = degree * (Math.PI / 180);
        const x = cx + radius * Math.cos(radians);
        const y = cy + radius * Math.sin(radians);
        setDots([...dots, { x, y, degree, type: 'key', color: 'blue' }]);
    };

    const removeDot = (degree, type) => {
        setDots(dots.filter(dot => dot.degree !== degree || dot.type !== type));
    };

    return (
        <div className="app-container">
          <SidePane />
            <svg width={svgSize} height={svgSize} className="svg-container">
                <MainCircle cx={cx} cy={cy} radius={radius} />
                {dots.map((dot, index) => (
                <SmallCircle key={index} x={dot.x} y={dot.y} type={dot.type} />
))}
            </svg>
            <AddNodeForm onAddServer={addServer} onAddKey={addKey} onRemove={removeDot} />
        </div>
    );
}

export default App;
