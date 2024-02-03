const searchBox = document.getElementById('searchBox');

// API endpoints
const playerUrl = 'https://www.balldontlie.io/api/v1/players/';
const statsUrl = 'https://www.balldontlie.io/api/v1/season_averages';

// Team colors
const teamColors = {
  ATL: { header: '#E03A3E', stats: '#C1D32F' },
  BOS: { header: '#007A33', stats: '#BA9653' },
  BKN: { header: '#000000', stats: '#000000' },
  CHA: { header: '#1D1160', stats: '#00788C' },
  CHI: { header: '#CE1141', stats: '#00788C' },
  CLE: { header: '#860038', stats: '#041E42' },
  DAL: { header: '#00538C', stats: '#002B5E' },
  DEN: { header: '#0E2240', stats: '#FEC524' },
  DET: { header: '#C8102E', stats: '#1D42BA' },
  GSW: { header: '#1D428A', stats: '#FFC72C' },
  HOU: { header: '#CE1141', stats: '#000000' },
  IND: { header: '#002D62', stats: '#FDBB30' },
  LAC: { header: '#C8102E', stats: '#1D428A' },
  LAL: { header: '#552583', stats: '#FDB927' },
  MEM: { header: '#12173F', stats: '#5D76A9' },
  MIA: { header: '#98002E', stats: '#000000' },
  MIL: { header: '#00471B', stats: '#000000' },
  MIN: { header: '#0C2340', stats: '#236192' },
  NOP: { header: '#0C2340', stats: '#C8102E' },
  NYK: { header: '#006BB6', stats: '#F58426' },
  OKC: { header: '#007AC1', stats: '#EF3B24' },
  ORL: { header: '#0077C0', stats: '#000000' },
  PHI: { header: '#006BB6', stats: '#ED174C' },
  PHX: { header: '#1D1160', stats: '#E56020' },
  POR: { header: '#E03A3E', stats: '#C1D32F' },
  SAC: { header: '#5A2D81', stats: '#63727A' },
  SAS: { header: '#000000', stats: '#C4CED4' },
  TOR: { header: '#CE1141', stats: '#000000' },
  UTA: { header: '#002B5C', stats: '#00471B' },
  WAS: { header: '#002B5C', stats: '#E31837' },
  default: { header: '#2c2c2c', stats: '#2c2c2c' },
};

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

  // Change player text color based on team
  const teamAbbreviation = player.team.abbreviation || 'default';

  document.querySelector('#player-header').style.color =
    teamColors[teamAbbreviation].header;
  document.querySelector('#player-stats').style.color =
    teamColors[teamAbbreviation].stats;
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
