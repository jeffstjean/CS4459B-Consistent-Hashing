import React, { useState, useEffect } from 'react';
import MainCircle from './Components/MainCircle';
import SmallCircle from './Components/SmallCircle';
//import AddNodeForm from './Components/AddNodeForm';
import ServerDetails from './Components/ServerDetails';
import './App.css';
import SidePane from './Components/SidePane';

function App() {
  const [servers, setServers] = useState([]);

  const [keys, setKeys] = useState([]); // Initialize keys state
  const [hoveredServerID, setHoveredServerID] = useState(null); // Track hovered server ID

  const radius = 300;
  const svgSize = 2 * radius + 100; // SVG size to accommodate the circle
  const cx = svgSize / 2; // Center x-coordinate of the circle
  const cy = svgSize / 2; // Center y-coordinate of the circle




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data

        const newServers = data
        .filter(server => server.status === "active") // Only proceed with active servers
        .map(server => {
          const degrees = (server.hash / 10000) * 360; // Convert hash to degrees
          const radians = degrees * (Math.PI / 180); // Convert degrees to radians for positioning
          // Calculate the x and y coordinates based on the converted radians
          return { 
            ...server, 
            x: cx + radius * Math.cos(radians), 
            y: cy + radius * Math.sin(radians) 
          };
        });
      

        const newKeys = data.flatMap(server =>
          server.data.map(key => {
            const degrees = (key.hash / 10000) * 360;
            const radians = degrees * (Math.PI / 180);
            return { ...key, serverHash: server.hash, x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians), type: 'key', keyValue: key.key };
          })
        );

        setServers(newServers);
        //setServers(servers.filter(server => server.status == "active"));

        setKeys(newKeys);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);
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

  const handleAddData = (hashedData) => {
    // Implement logic to update data in parent component
    // POST data entered
    console.log('Data added:', hashedData);
  };

  const handleActivateNode = () => {
    // Implement logic to add a node
    // POST CMD ACTIVATENODE
    console.log('Node added');
  };

  const handleDeactivateNode = () => {
    // Implement logic to remove a node
    // POST CMD DEACTIVATENODE
    console.log('Node removed');
  };

  return (
    <div className="app-container">
       <SidePane
      onAddData={handleAddData}
      onActivateNode={handleActivateNode}
      onDeactivateNode={handleDeactivateNode}
      server={servers.find(server => server.hash === hoveredServerID)} // Pass hovered server data
    />
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
            isHighlighted={hoveredServerID === server.hash} 
            port = {server.port}// Additional prop for server highlighting
          />
        ))}
        {keys.map((key, index) => (
          <SmallCircle
            key={index}
            x={key.x}
            y={key.y}
            type="key"
            isHighlighted={hoveredServerID === key.serverHash} 
            keyValue = {key.keyValue}// Determine if the key should highlight
          />
        ))}
      </svg>
      {/* {hoveredServerID && <ServerDetails server={servers.find(server => server.hash === hoveredServerID)} />} */}
    </div>
  );
}

export default App;