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
  CHI: { header: '#CE1141', stats: '#000000' },
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

  // Display player name
  const nameHeader = document.createElement('h1');
  nameHeader.textContent = `${first_name} ${last_name}`;
  nameHeader.classList.add('heading-lg');
  document.querySelector('#player-header').appendChild(nameHeader);

  // Display player info
  const playerInfo = document.createElement('p');

  // Check if position, height, and weight are available before displaying
  const playerPosition = position ? position : '';
  const playerHeight =
    height_feet !== null ? `${height_feet}'${height_inches}"` : '';
  const playerWeight = weight_pounds !== null ? `${weight_pounds} lbs` : '';

  // Display all available player info
  let infoString = `${team.full_name}`;
  if (playerPosition) infoString += ` • ${playerPosition}`;
  if (playerHeight || playerWeight) {
    infoString += ` • ${playerHeight}, ${playerWeight}`;
  }

  playerInfo.innerHTML = infoString;
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
    season,
  } = stats;

  displayMainAverages({ pts, ast, reb, fg_pct });
  displaySeasonStatsHeader({ season });
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
    season,
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
const displaySeasonStatsHeader = ({ season }) => {
  const header = document.createElement('p');
  header.classList.add('heading-sm');
  header.textContent = `${season}-${season + 1} SEASON STATS`;
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
    season,
  } = stats;

  const table = document.createElement('div');
  table.classList.add('stats-table');
  table.innerHTML = `
    <table>
      <tr>
        <th>SEASON</th>
        <th>GP</th>
        <th class="screen-md">MIN</th>
        <th>FG%</th>
        <th>3P%</th>
        <th class="screen-md">FTM</th>
        <th class="screen-md">FTA</th>
        <th>FT%</th>
        <th class="screen-sm">OREB</th>
        <th class="screen-sm">DREB</th>
        <th>REB</th>
        <th>AST</th>
        <th>STL</th>
        <th>BLK</th>
        <th class="screen-sm">TOV</th>
        <th class="screen-sm">PF</th>
        <th>PTS</th>
      </tr>
      <tr>
        <td>${season}</td>
        <td>${games_played}</td>
        <td class="screen-md">${min}</td>
        <td>${(fg_pct * 100).toFixed(1)}</td>
        <td>${(fg3_pct * 100).toFixed(1)}</td>
        <td class="screen-md">${ftm.toFixed(1)}</td>
        <td class="screen-md">${fta.toFixed(1)}</td>
        <td>${(ft_pct * 100).toFixed(1)}</td>
        <td class="screen-sm">${oreb.toFixed(1)}</td>
        <td class="screen-sm">${dreb.toFixed(1)}</td>
        <td>${reb.toFixed(1)}</td>
        <td>${ast.toFixed(1)}</td>
        <td>${stl.toFixed(1)}</td>
        <td>${blk.toFixed(1)}</td>
        <td class="screen-sm">${turnover.toFixed(1)}</td>
        <td class="screen-sm">${pf.toFixed(1)}</td>
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
const fetchPlayerStats = async (playerId, selectedSeason) => {
  showSpinner();

  try {
    const response = await fetch(
      statsUrl + `?season=${selectedSeason}&player_ids[]=${playerId}`
    );
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      showError(
        'Player stats not found for this NBA season. Try selecting a different year.'
      );
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
  const selectedSeason = seasonDropdown.value;

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

    searchBox.value = `${player.first_name} ${player.last_name}`;

    // Display player info to DOM
    displayPlayerInfo(player);

    // Fetch player stats using player id
    const playerId = player.id;
    const stats = await fetchPlayerStats(playerId, selectedSeason);

    if (stats) {
      // Display player stats to DOM
      displayPlayerStats(stats);
    }
  } catch (error) {
    console.log(error);
  }
};

// Season dropdown menu
const displayDropdownMenu = () => {
  const dropdown = document.getElementById('season-dropdown');

  const startYear = 1970;
  const endYear = new Date().getFullYear() - 1;

  // Populate dropdown with years
  for (let year = endYear; year >= startYear; year--) {
    const option = document.createElement('option');
    option.text = `${year}-${year + 1}`;
    option.value = year;
    dropdown.add(option);
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

// Event listeners

// Display season dropdown menu on page load
document.addEventListener('DOMContentLoaded', displayDropdownMenu);

// Search stats when the selected season changes
const seasonDropdown = document.getElementById('season-dropdown');
seasonDropdown.addEventListener('change', () => {
  search();
});

// Accept enter key on search
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
