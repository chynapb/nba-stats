const searchBox = document.getElementById('searchBox');
const errorDiv = document.getElementById('error');
const playerData = document.getElementById('player-data');
const playerHeader = document.getElementById('player-header');
const playerDescription = document.getElementById('player-description');
const playerStats = document.getElementById('player-stats');

// API endpoints
const playerUrl = 'https://www.balldontlie.io/api/v1/players/';
const statsUrl = 'https://www.balldontlie.io/api/v1/season_averages';

// Display player information
const displayPlayerInfo = (player) => {
  const {
    first_name,
    last_name,
    position,
    team,
    height_feet,
    height_inches,
    weight_pounds,
  } = player;
  const playerPosition = position === '' ? 'N/A' : position;
  const playerHeight =
    height_feet === null ? 'N/A' : `${height_feet}'${height_inches}"`;
  const playerWeight = weight_pounds === null ? 'N/A' : `${weight_pounds} lbs`;

  // Display player name
  const nameHeader = document.createElement('h1');
  nameHeader.textContent = `${first_name} ${last_name}`;
  nameHeader.classList.add('heading-lg');
  playerHeader.appendChild(nameHeader);

  // Display player info
  const playerInfo = document.createElement('p');
  playerInfo.innerHTML = `${team.full_name} • ${playerPosition} • ${playerHeight}, ${playerWeight}`;
  playerDescription.appendChild(playerInfo);
};

// Display player stats
const displayPlayerStats = (stats) => {
  const {
    ast,
    blk,
    dreb,
    fg3_pct,
    fg3m,
    fg_pct,
    fga,
    ft_pct,
    fta,
    ftm,
    games_played,
    min,
    oreb,
    pf,
    pts,
    reb,
    season,
    stl,
    turnover,
  } = stats;

  // Stats header
  // const statsHeader = document.createElement('p');
  // statsHeader.classList.add('heading-sm');
  // statsHeader.innerHTML = '2023-24 SEASON STATS';
  // playerStats.appendChild(statsHeader);

  // Display season averages
  const seasonAvgs = document.createElement('div');
  seasonAvgs.innerHTML = `<div class="season-avgs">
  <div>
    <p class="heading-md avg-main">${pts.toFixed(1)}</p>
    <p class="heading-sm avg-secondary">PPG</p>
  </div>
  <div>
    <p class="heading-md avg-main">${ast.toFixed(1)}</p>
    <p class="heading-sm avg-secondary">APG</p>
  </div>
  <div>
    <p class="heading-md avg-main">${reb.toFixed(1)}</p>
    <p class="heading-sm avg-secondary">RPG</p>
  </div>
  <div>
    <p class="heading-md avg-main">${(fg_pct * 100).toFixed(1) + '%'}</p>
    <p class="heading-sm avg-secondary">FG%</p>
  </div>
</div>`;
  playerStats.appendChild(seasonAvgs);
};

// Display error message
const showError = (message) => {
  // Clear previous data
  errorDiv.innerHTML = '';

  // Display error message
  const errorMsg = document.createElement('p');
  errorMsg.innerHTML = message;
  errorMsg.classList.add('error');
  errorDiv.appendChild(errorMsg);
};

// Fetch data on search
const search = () => {
  const searchTerm = searchBox.value.trim();

  if (!searchTerm) {
    alert('Please enter a player.');
    return;
  }

  fetch(playerUrl + `?search=${searchTerm}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.data || data.data.length === 0) {
        showError('Player not found: Please try your search again.');
        return;
      }
      // Clear previous data
      errorDiv.innerHTML = '';
      playerHeader.innerHTML = '';
      playerDescription.innerHTML = '';
      playerStats.innerHTML = '';

      const player = data.data[0];
      // Fetch player info and display to DOM
      displayPlayerInfo(player);

      // Fetch stats using player id
      const playerId = player.id;

      fetch(statsUrl + `?player_ids[]=${playerId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.data || data.data.length === 0) {
            showError('Player stats not found for the current NBA season.');
            return;
          }
          // Clear previous data
          playerStats.innerHTML = '';

          // Fetch player stats and display to DOM
          const stats = data.data[0];
          displayPlayerStats(stats);
        })
        .catch((error) => {
          showError('Error fetching player stats. Please try again.');
        });
    })
    .catch((error) => {
      showError('Error fetching player. Please try again.');
    })
    .finally(() => {
      searchBox.value = '';
    });
};

// Accept enter key
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
