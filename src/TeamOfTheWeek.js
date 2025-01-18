import React from 'react';

const TeamOfTheWeek = ({ players = [], onPlayerClick }) => {
  const getTopPlayers = (position, count) => {
    if (!players || players.length === 0) return [];
    return players
      .filter((player) => player.position === position)
      .sort((a, b) => b.predicted_points - a.predicted_points)
      .slice(0, count);
  };

  // Fixed 3-4-3 formation
  const formation = [
    { position: 'GKP', count: 1 },
    { position: 'DEF', count: 3 },
    { position: 'MID', count: 4 },
    { position: 'FWD', count: 3 }
  ];

  const lineup = formation.map(({ position, count }) =>
    getTopPlayers(position, count)
  );

  return (
    <div className="w-full">
      <div
        className="w-full bg-cover bg-center min-h-screen relative"
        style={{
          backgroundImage: "url('/field.png')",
        }}
      >
        {/* Reduced top padding here */}
        <div className="pt-4 md:pt-8 lg:pt-12 pb-4 md:pb-6 lg:pb-8">
          <h2 className="text-white text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 lg:mb-4">
            Team of the Week
          </h2>
          <h4 className="text-green-500 text-center text-lg md:text-xl lg:text-2xl font-bold mb-1">
            Gameweek 23 PREMSCOUT Projected Points
          </h4>
          <p className="text-white text-center text-base md:text-lg lg:text-xl">
            Formation: 3-4-3
          </p>
        </div>

        {/* Adjusted spacing between rows */}
        <div className="flex flex-col items-center space-y-4 md:space-y-6 lg:space-y-8 px-2 md:px-4 lg:px-8">
          {lineup.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="w-full flex justify-center"
            >
              <div className="inline-flex flex-nowrap overflow-x-auto gap-2 md:gap-4 lg:gap-8 justify-center min-w-0">
                {row.map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className="flex-shrink-0 w-24 md:w-28 lg:w-32"
                  >
                    <div
                      className="relative flex flex-col items-center shadow-lg rounded-lg h-36 md:h-42 lg:h-48 cursor-pointer bg-white overflow-hidden hover:scale-105 transition-transform duration-200"
                      onClick={() => onPlayerClick(player)}
                    >
                      <div className="flex flex-col items-center p-2 md:p-3 w-full">
                        <h3
                          className="text-xs md:text-sm font-bold text-center text-gray-800 mb-1 truncate w-full"
                          title={player.name}
                        >
                          {player.name}
                        </h3>
                        <p className="text-xs font-medium text-gray-600 mb-0.5 md:mb-1">
                          {player.team}
                        </p>
                        <p className="text-xs font-medium text-gray-600 mb-1 md:mb-2">
                          {player.position}
                        </p>
                        <p className="text-base md:text-lg lg:text-xl font-extrabold text-gray-800">
                          {Math.round(player.predicted_points * 10) / 10} pts
                        </p>
                      </div>
                      <div className="absolute bottom-0 w-full bg-purple-700 text-white py-1 md:py-2 text-center">
                        <p className="text-xs font-medium">{player.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamOfTheWeek;