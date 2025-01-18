import React, { useState } from "react";

const PlayerTable = ({ players = [], onPlayerClick = () => {} }) => {
  const [filter, setFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20.0]); // Changed maximum to 20.0
  const [sortField, setSortField] = useState(null);
  const [decending, setDecending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const playersPerPage = 20;

  const filteredPlayers = (players || []).filter((player) => {
    const matchesName = player.name && player.name.toLowerCase().includes(filter.toLowerCase());
    const matchesPosition = positionFilter ? player.position === positionFilter : true;
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesPrice = (player.now_cost) >= priceRange[0] && (player.now_cost) <= priceRange[1]; // Adjusted for actual price in millions
    return matchesName && matchesPosition && matchesTeam && matchesPrice;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (!sortField) return 0;
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (aValue === undefined) aValue = "";
    if (bValue === undefined) bValue = "";
    if (typeof aValue === "string" && !isNaN(aValue)) {
      aValue = parseFloat(aValue);
    }
    if (typeof bValue === "string" && !isNaN(bValue)) {
      bValue = parseFloat(bValue);
    }
    if (sortField === "predicted_points" || sortField === "expected_goals") {
      aValue = Math.round(aValue * 10) / 10;
      bValue = Math.round(bValue * 10) / 10;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    return decending ? (aValue < bValue ? 1 : -1) : (aValue > bValue ? 1 : -1);
  });

  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const paginatedPlayers = sortedPlayers.slice(startIndex, startIndex + playersPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setDecending(!decending);
    } else {
      setSortField(field);
      setDecending(true);
    }
  };

  const teams = [...new Set((players || []).map((player) => player.team))].sort();

  const isPremscoutColumn = (field) => {
    return field === "expected_goals" || field === "predicted_points";
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="p-2 sm:p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-100 text-center">Player Data</h2>

        {/* Filter Section - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4">
          <input
            type="text"
            placeholder="Search players..."
            className="p-2 sm:p-3 border rounded-full bg-gray-700 text-gray-100 border-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-center w-full"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <select
            className="p-2 sm:p-3 border rounded-full bg-indigo-900 text-gray-100 border-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center appearance-none w-full hover:bg-indigo-800 transition-colors"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="">All Positions</option>
            <option value="GKP">Goalkeeper</option>
            <option value="DEF">Defender</option>
            <option value="MID">Midfielder</option>
            <option value="FWD">Forward</option>
          </select>

          <select
            className="p-2 sm:p-3 border rounded-full bg-indigo-900 text-gray-100 border-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center appearance-none w-full hover:bg-indigo-800 transition-colors"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSortField(null);
              setDecending(true);
              setCurrentPage(1);
            }}
            className="p-2 sm:p-3 bg-gray-700 text-gray-100 rounded-full shadow-sm hover:bg-gray-600 w-full"
          >
            Reset Sort
          </button>
        </div>

        {/* Price Range Slider - Full Width with 0.1M increments */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 px-4">
          <label className="text-gray-100 whitespace-nowrap">Price Range:</label>
          <input
            type="range"
            min="0"
            max="16.0"
            step="0.1"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseFloat(e.target.value)])}
            className="w-full focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-100 whitespace-nowrap">${priceRange[1].toFixed(1)}M</span>
        </div>

            
        {/* Rest of the component remains the same */}
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <div className="min-w-[1000px]">
            <table className="w-full table-auto">
              <thead className="bg-indigo-900">
                <tr>
                  {[
                    { field: "name", label: "Name" },
                    { field: "team", label: "Team" },
                    { field: "position", label: "Pos" },
                    { field: "expected_goals", label: "xG" },
                    { field: "predicted_points", label: "Pred. Pts" },
                    { field: "goals_scored", label: "Goals" },
                    { field: "total_points", label: "Pts" },
                    { field: "now_cost", label: "Price" },
                    { field: "form", label: "Form" },
                    { field: "assists", label: "Ast" },
                    { field: "clean_sheets", label: "CS" },
                    { field: "saves_per_90", label: "Sv90" }
                  ].map(({ field, label }, index, array) => (
                    <th
                      key={label}
                      className={`p-2 sm:p-3 border-b border-gray-800 cursor-pointer text-center ${
                        isPremscoutColumn(field) ? 'text-green-400' : 'text-gray-100'
                      } ${
                        sortField === field ? "bg-indigo-800" : ""
                      } ${
                        index === 0 ? 'rounded-tl-lg' : ''
                      } ${
                        index === array.length - 1 ? 'rounded-tr-lg' : ''
                      }`}
                      onClick={() => field && toggleSort(field)}
                    >
                      <span className="flex items-center justify-center text-xs sm:text-sm">
                        {label}
                        {field && sortField === field && (
                          <span className="ml-1 sm:ml-2 text-xs">
                            {decending ? "🔽" : "🔼"}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedPlayers.map((player, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-black" : "bg-gray-900"
                    } ${
                      index === paginatedPlayers.length - 1 ? "last-row" : ""
                    }`}
                  >
                    <td
                      className={`p-2 sm:p-3 text-blue-400 cursor-pointer hover:text-blue-300 underline text-center border-b border-gray-800 ${
                        index === paginatedPlayers.length - 1 ? "rounded-bl-lg" : ""
                      }`}
                      onClick={() => onPlayerClick(player)}
                    >
                      <span className="text-xs sm:text-sm">{player.name}</span>
                    </td>
                    {[
                      player.team,
                      player.position,
                      player.expected_goals !== undefined ? parseFloat(player.expected_goals).toFixed(1) : "0.0",
                      player.predicted_points !== undefined && player.predicted_points !== null ? Math.round(player.predicted_points * 10) / 10 : "0.0",
                      player.goals_scored,
                      player.total_points,
                      `$${(player.now_cost / 10).toFixed(1)}M`, // Adjusted to show actual price in millions
                      player.form,
                      player.assists,
                      player.clean_sheets,
                      player.saves_per_90
                    ].map((value, cellIndex, array) => (
                      <td
                        key={cellIndex}
                        className={`p-2 sm:p-3 ${
                          cellIndex < 2 ? 'text-gray-100' : 
                          cellIndex < 4 ? 'text-green-400' : 'text-gray-100'
                        } text-center border-b border-gray-800 ${
                          index === paginatedPlayers.length - 1 && cellIndex === array.length - 1 ? "rounded-br-lg" : ""
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{value}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded w-full sm:w-auto ${
              currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-gray-100"
            }`}
          >
            Previous
          </button>
          <p className="text-gray-100 text-sm sm:text-base">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded w-full sm:w-auto ${
              currentPage === totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerTable;