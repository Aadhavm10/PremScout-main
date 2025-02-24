import React, { useMemo } from 'react';

const PlayerCard = ({ player, onClose, allPlayers = [] }) => {
  const calculateValueRating = useMemo(() => {
    // Group players by position
    const playersByPosition = allPlayers.reduce((acc, p) => {
      if (!acc[p.position]) {
        acc[p.position] = [];
      }
      acc[p.position].push(p);
      return acc;
    }, {});

    // Find best player in the position based on total points
    const bestInPosition = playersByPosition[player.position]?.reduce((best, curr) => 
      (curr.total_points > best.total_points) ? curr : best
    , playersByPosition[player.position][0]);

    if (!bestInPosition) return 0;

    // Calculate relative value (1-5 stars)
    // Value = (player points / best player points) * 5
    const relativeValue = Math.round((player.total_points / bestInPosition.total_points) * 5);
    
    // Ensure value is between 1 and 5
    return Math.max(1, Math.min(5, relativeValue));
  }, [player.position, player.total_points, allPlayers]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[90%] md:max-w-[80%] lg:max-w-[900px] relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-600 hover:text-black text-xl md:text-2xl"
        >
          &#x2715;
        </button>

        {/* Player Image */}
        <div className="w-full md:w-1/3 p-4 flex items-center justify-center">
          <img
            src={player.image || "/placeholder.png"}
            alt={player.name}
            className="w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 object-cover rounded-full border-4 border-gray-300"
          />
        </div>

        {/* Player Info */}
        <div className="w-full md:w-2/3 p-4 md:p-6 lg:p-8">
          {/* Team and Name */}
          <div className="text-center md:text-left mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
              {player.team}
            </h2>
            <h1 className="text-3xl md:text-4xl font-extrabold">{player.name}</h1>
            <p className="text-lg md:text-xl text-gray-500 mt-2">{player.position}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { label: "Total Points", value: player.total_points },
              { label: "Price", value: `$${(player.now_cost / 10 * 10).toFixed(1)}M` },
              { label: "Goals", value: player.goals_scored },
              { label: "Assists", value: player.assists },
              { label: "Chance of Playing", value: `${player.chance_of_playing_this_round}%` },
              { label: "Form", value: player.form }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-sm md:text-base text-gray-500">{stat.label}</p>
                <p className="text-lg md:text-xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Value Rating */}
          <div className="mt-6 text-center relative group">
            <p className="text-gray-500 text-base md:text-lg mb-2">Position Value Rating</p>
            <div className="text-yellow-500 text-2xl md:text-3xl">
              {"★".repeat(calculateValueRating)}
              {"☆".repeat(5 - calculateValueRating)}
            </div>
            <div className="invisible group-hover:visible absolute w-full bg-gray-800 text-white text-sm p-2 rounded mt-2">
              Rating based on performance relative to the best player in {player.position} position
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;