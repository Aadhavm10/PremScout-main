import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import TeamOfTheWeek from "./TeamOfTheWeek";
import PlayerTable from "./PlayerTable";
import PlayerCard from "./PlayerCard";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [headshots, setHeadshots] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("gameweek_23_predictions.csv");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            console.log("Raw player data:", result.data); // Debugging log
            const processedData = processPlayerValues(result.data);
            console.log("Processed player data:", processedData); // Debugging log
            setPlayers(processedData);
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing player dataset:", error);
      }
    };

    const fetchHeadshots = async () => {
      try {
        const response = await fetch("playerImages.csv");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            // Log the first few rows to verify structure
            console.log("Sample headshots data:", result.data.slice(0, 3));
            
            const mappedHeadshots = result.data.reduce((acc, row) => {
              // Make sure we're using the exact column names from your CSV
              const name = row.name ? row.name.trim().toLowerCase() : null;
              const url = row.image_url ? row.image_url.trim() : null;
              
              if (name && url) {
                acc[name] = url;
              }
              return acc;
            }, {});
            
            setHeadshots(mappedHeadshots);
            
            // Log the first few mapped headshots
            console.log("First few mapped headshots:", 
              Object.entries(mappedHeadshots).slice(0, 3));
          }
        });
      } catch (error) {
        console.error("Error fetching headshots dataset:", error);
      }
    };
    fetchData();
    fetchHeadshots();
  }, []);

  const processPlayerValues = (playersData) => {
    const highestPointsByPosition = playersData.reduce((acc, player) => {
      const points = parseFloat(player.expected_points) || 0;
      const position = player.position || "Unknown";
      if (!acc[position] || points > acc[position]) {
        acc[position] = points;
      }
      return acc;
    }, {});

    return playersData.map((player) => {
      const position = player.position || "Unknown";
      const highestPoints = highestPointsByPosition[position] || 1;
      const playerPoints = parseFloat(player.expected_points) || 0;
      const value = Math.min(5, Math.round((playerPoints / highestPoints) * 5));
      return {
        ...player,
        value,
        position,
      };
    });
  };

  const enrichedPlayers = players.map((player) => {
    const normalizedPlayerName = player.name ? player.name.trim().toLowerCase() : "";
    const imageUrl = headshots[normalizedPlayerName];
    return {
      ...player,
      image: imageUrl || "/placeholder.png",
    };
  });

  // In App.js
return (
  <div className="w-full min-h-screen bg-black">
    <h1 className="text-white text-3xl font-bold mb-6 p-12">PREMSCOUT</h1>

    <TeamOfTheWeek
      players={enrichedPlayers}
      onPlayerClick={setSelectedPlayer}
    />

    <PlayerTable
      players={enrichedPlayers}
      onPlayerClick={setSelectedPlayer}
    />

    {selectedPlayer && (
      <PlayerCard
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    )}
  </div>
);
};

export default App;
