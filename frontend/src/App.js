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
        {
            "hash": 4387,
            "lastHb": "Tue, 09 Apr 2024 19:24:15 GMT",
            "name": "server.002",
            "port": 4002,
            "status": "active",
            "data": [
                {
                    "key": "somekey",
                    "value": "somevalue",
                    "hash": 1024
                },
                {
                  "key": "one more key",
                  "value": "one value",
                  "hash": 483
              }
            ]
        },
        {
          "hash": 4324,
          "lastHb": "Tue, 09 Apr 2024 19:24:15 GMT",
          "name": "server.002",
          "port": 4003,
          "status": "active",
          "data": [
              {
                  "key": "somekey",
                  "value": "somevalue",
                  "hash": 1024
              }
          ]
      }
    ]
  );
  const [keys, setKeys] = useState([]); // Initialize keys state





    const [hoveredServerID, setHoveredServerID] = useState(null); // Track hovered server ID

    const radius = 300;
    const svgSize = 2 * radius + 50; // SVG size to accommodate the circle
    const cx = svgSize / 2; // Center x-coordinate of the circle
    const cy = svgSize / 2; // Center y-coordinate of the circle

   


    useEffect(() => {
      const newServers = servers.map(server => {
          const radians = server.hash * (Math.PI / 180);
          return { ...server, x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
      });

      const newKeys = servers.flatMap(server => 
          server.data.map(key => {
              const radians = key.hash * (Math.PI / 180);
              return {
                  ...key,
                  serverName: server.name, // Optionally track which server the key belongs to
                  x: cx + radius * Math.cos(radians),
                  y: cy + radius * Math.sin(radians),
                  type: 'key'
              };
          })
      );

      setServers(newServers);
      setKeys(newKeys);
  }, [servers]); 
    // const addServer = (serverData) => {
    //     const radians = serverData.degree * (Math.PI / 180);
    //     const x = cx + radius * Math.cos(radians);
    //     const y = cy + radius * Math.sin(radians);
    //     setServers([...servers, { ...serverData, x, y }]);
    // };

    const removeServer = (name) => {
        setServers(servers.filter(server => server.name !== name));
    };

    const hoveredServer = servers.find(server => server.hash === hoveredServerID);

    return (
      <div className="app-container">
        <SidePane />
        <svg width={svgSize} height={svgSize} className="svg-container">
            <MainCircle cx={cx} cy={cy} radius={radius} />
            {servers.map(server => (
                <SmallCircle
                    key={server.hash}
                    x={server.x}
                    y={server.y}
                    type="server"
                    setHoveredServerID={setHoveredServerID}
                    serverID={server.hash}
                />
            ))}
            {keys.map((key, index) => (
                <SmallCircle
                    key={index}
                    x={key.x}
                    y={key.y}
                    type="key"
                    // You may want to handle key hover differently
                />
            ))}
        </svg>
        {hoveredServerID && <ServerDetails server={servers.find(server => server.hash === hoveredServerID)} />}
      </div>
    );
}

export default App;