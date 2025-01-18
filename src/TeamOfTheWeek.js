import React from "react";

const TeamOfTheWeek = ({ players = [], onPlayerClick }) => {
  const formation = [
    { position: "GKP", count: 1 },
    { position: "DEF", count: 3 },
    { position: "MID", count: 4 },
    { position: "FWD", count: 3 },
  ];

  const getTopPlayers = (position, count) => {
    if (!players || players.length === 0) return [];
    return players
      .filter((player) => player.position === position)
      .sort((a, b) => b.predicted_points - a.predicted_points)
      .slice(0, count);
  };

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
        {/* Responsive header section */}
        <div className="pt-8 md:pt-16 lg:pt-24 pb-8 md:pb-12 lg:pb-16">
          <h2 className="text-white text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lg:mb-8">
            Team of the Week
          </h2>
          <h4 className="text-green-500 text-center text-lg md:text-xl lg:text-2xl font-bold">
            Gameweek 23 PREMSCOUT Projected Points
          </h4>
        </div>

        {/* Responsive player grid */}
        <div className="flex flex-col items-center space-y-6 md:space-y-8 lg:space-y-12 px-2 md:px-4 lg:px-8">
          {lineup.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-wrap justify-center w-full gap-2 md:gap-4 lg:gap-8"
            >
              {row.map((player, playerIndex) => (
                <div
                  key={playerIndex}
                  className="relative flex flex-col items-center shadow-lg rounded-lg w-24 md:w-28 lg:w-32 h-36 md:h-42 lg:h-48 cursor-pointer bg-white overflow-hidden hover:scale-105 transition-transform duration-200"
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
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamOfTheWeek;