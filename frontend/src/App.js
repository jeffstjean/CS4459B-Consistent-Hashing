import React, { useState, useEffect } from 'react';
import MainCircle from './Components/MainCircle';
import SmallCircle from './Components/SmallCircle';
//import AddNodeForm from './Components/AddNodeForm';
import ServerDetails from './Components/ServerDetails';
import './App.css';
import SidePane from './Components/SidePane';

function App() {
    const [servers, setServers] = useState(
      [
        // Initial sample data, adjusted degree to fit within 0-360
        {
            "lastHb": "Tue, 09 Apr 2024 19:04:10 GMT",
            "name": "server.002",
            "port": 4002,
            "status": "active",
            "degree": 245104679463529657441854513498226685595
        },
        {
            "lastHb": "Tue, 09 Apr 2024 19:04:12 GMT",
            "name": "server.003",
            "port": 4003,
            "status": "active",
            "degree": 847395679463529657441854513498226685783 // Adjusted for example
        }
    ]);
    const [hoveredServerID, setHoveredServerID] = useState(null); // Track hovered server ID

    const radius = 300;
    const svgSize = 2 * radius + 50; // SVG size to accommodate the circle
    const cx = svgSize / 2; // Center x-coordinate of the circle
    const cy = svgSize / 2; // Center y-coordinate of the circle

    // Use effect to convert degrees to Cartesian coordinates for initial server data
    useEffect(() => {
        setServers(servers.map(server => {
            const radians = server.degree * (Math.PI / 180);
            const x = cx + radius * Math.cos(radians);
            const y = cy + radius * Math.sin(radians);
            return { ...server, x, y };
        }));
    }, []); // Empty dependency array ensures this runs once on mount

    // const addServer = (serverData) => {
    //     const radians = serverData.degree * (Math.PI / 180);
    //     const x = cx + radius * Math.cos(radians);
    //     const y = cy + radius * Math.sin(radians);
    //     setServers([...servers, { ...serverData, x, y }]);
    // };

    const removeServer = (name) => {
        setServers(servers.filter(server => server.name !== name));
    };

    const hoveredServer = servers.find(server => server.name === hoveredServerID);

    return (
      <div className="app-container">
        <SidePane />
          <svg width={svgSize} height={svgSize} className="svg-container">
              <MainCircle cx={cx} cy={cy} radius={radius} />
              {servers.map(server => (
                  <SmallCircle
                      key={server.name}
                      x={server.x}
                      y={server.y}
                      type="server"
                      setHoveredServerID={setHoveredServerID}
                      serverID={server.name} // Use server name as a unique identifier
                  />
              ))}
          </svg>
          {hoveredServer && <ServerDetails server={hoveredServer} />}
          {/* <AddNodeForm onAddServer={addServer} /> */}
      </div>
  );
}

export default App;