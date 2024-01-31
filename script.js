const searchBox = document.getElementById('searchBox');

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
  document.querySelector('#player-header').appendChild(nameHeader);

  // Display player info
  const playerInfo = document.createElement('p');
  playerInfo.innerHTML = `${team.full_name} • ${playerPosition} • ${playerHeight}, ${playerWeight}`;
  document.querySelector('#player-description').appendChild(playerInfo);
};

// Display player stats
const displayPlayerStats = (stats) => {
  const {
    ast,
    blk,
    dreb,
    fg3_pct,
    fg_pct,
    ft_pct,
    fta,
    ftm,
    games_played,
    min,
    oreb,
    pf,
    pts,
    reb,
    stl,
    turnover,
  } = stats;

  displayMainAverages({ pts, ast, reb, fg_pct });
  displaySeasonStatsHeader();
  displaySeasonStatsTable({
    games_played,
    min,
    fg_pct,
    fg3_pct,
    ftm,
    fta,
    ft_pct,
    oreb,
    dreb,
    reb,
    ast,
    stl,
    blk,
    pts,
    turnover,
    pf,
  });
};

// Display main player averages
const displayMainAverages = ({ pts, ast, reb, fg_pct }) => {
  const mainAvgs = document.createElement('div');
  mainAvgs.innerHTML = `
    <div class="main-avgs">
      ${createMainAvgItem('PPG', pts.toFixed(1))}
      ${createMainAvgItem('APG', ast.toFixed(1))}
      ${createMainAvgItem('RPG', reb.toFixed(1))}
      ${createMainAvgItem('FG%', (fg_pct * 100).toFixed(1) + '%')}
    </div>`;
  document.querySelector('#player-stats').appendChild(mainAvgs);
};

// Create main average item
const createMainAvgItem = (label, value) => `
  <div>
    <p class="heading-md avg-main">${value}</p>
    <p class="heading-sm avg-secondary">${label}</p>
  </div>
`;

// Display season stats header
const displaySeasonStatsHeader = () => {
  const header = document.createElement('p');
  header.classList.add('heading-sm');
  header.textContent = '2023-24 SEASON STATS';
  document.querySelector('#season-header').appendChild(header);
};

// Display season stats table
const displaySeasonStatsTable = (stats) => {
  const {
    games_played,
    min,
    fg_pct,
    fg3_pct,
    ftm,
    fta,
    ft_pct,
    oreb,
    dreb,
    reb,
    ast,
    stl,
    blk,
    turnover,
    pts,
    pf,
  } = stats;

  const table = document.createElement('div');
  table.classList.add('stats-table');
  table.innerHTML = `
    <table>
      <tr>
        <th>GP</th>
        <th>MIN</th>
        <th>FG%</th>
        <th>3P%</th>
        <th>FTM</th>
        <th>FTA</th>
        <th>FT%</th>
        <th>OREB</th>
        <th>DREB</th>
        <th>REB</th>
        <th>AST</th>
        <th>STL</th>
        <th>BLK</th>
        <th>TOV</th>
        <th>PF</th>
        <th>PTS</th>
      </tr>
      <tr>
        <td>${games_played}</td>
        <td>${min}</td>
        <td>${(fg_pct * 100).toFixed(1)}</td>
        <td>${(fg3_pct * 100).toFixed(1)}</td>
        <td>${ftm.toFixed(1)}</td>
        <td>${fta.toFixed(1)}</td>
        <td>${(ft_pct * 100).toFixed(1)}</td>
        <td>${oreb.toFixed(1)}</td>
        <td>${dreb.toFixed(1)}</td>
        <td>${reb.toFixed(1)}</td>
        <td>${ast.toFixed(1)}</td>
        <td>${stl.toFixed(1)}</td>
        <td>${blk.toFixed(1)}</td>
        <td>${turnover.toFixed(1)}</td>
        <td>${pf.toFixed(1)}</td>
        <td>${pts.toFixed(1)}</td>
      </tr>
    </table>`;
  document.querySelector('#season-avgs').appendChild(table);
};

// Fetch player data
const fetchPlayerData = async (searchTerm) => {
  showSpinner();

  try {
    const response = await fetch(playerUrl + `?search=${searchTerm}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      showError('Player not found: Please try your search again.');
      return null;
    }

    hideSpinner();

    return data.data[0];
  } catch (error) {
    console.log(error);
    showError('Error fetching player. Please try again.');
    return null;
  }
};

// Fetch player stats
const fetchPlayerStats = async (playerId) => {
  showSpinner();

  try {
    const response = await fetch(statsUrl + `?player_ids[]=${playerId}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      showError('Player stats not found for the current NBA season.');
      return null;
    }

    hideSpinner();

    return data.data[0];
  } catch (error) {
    console.log(error);
    showError('Error fetching player stats. Please try again.');
    return null;
  }
};

// Fetch data on search
const search = async () => {
  const searchTerm = searchBox.value.trim();

  if (!searchTerm) {
    alert('Please enter a player.');
    return;
  }

  try {
    // Clear previous data
    clearElements(
      'error',
      'player-header',
      'player-description',
      'season-avgs',
      'season-header',
      'player-stats'
    );

    // Fetch player data
    const player = await fetchPlayerData(searchTerm);

    if (!player) {
      return;
    }

    // Display player info to DOM
    displayPlayerInfo(player);

    // Fetch player stats using player id
    const playerId = player.id;
    const stats = await fetchPlayerStats(playerId);

    if (stats) {
      // Display player stats to DOM
      displayPlayerStats(stats);
    }
  } finally {
    searchBox.value = '';
  }
};

// Display error message
const showError = (message) => {
  clearElements(
    'error',
    'player-header',
    'player-description',
    'player-stats',
    'season-avgs',
    'season-header'
  );

  // Display error message
  const errorMsg = document.createElement('p');
  errorMsg.innerHTML = message;
  errorMsg.classList.add('error');
  document.querySelector('#error').appendChild(errorMsg);

  hideSpinner();
};

// Show and hide loading spinner
const showSpinner = () => {
  document.querySelector('.spinner').classList.add('show');
};

const hideSpinner = () => {
  document.querySelector('.spinner').classList.remove('show');
};

// Clear previous data on each render
const clearElements = (...elementIds) => {
  elementIds.forEach((id) => {
    document.querySelector(`#${id}`).innerHTML = '';
  });
};

// Accept enter key
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
