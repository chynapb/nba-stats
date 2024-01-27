const searchBox = document.getElementById('searchBox');
const statsDiv = document.getElementById('stats');
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
  const playerName = `${first_name} ${last_name}`;
  const playerPosition = position === '' ? 'N/A' : position;
  const playerTeam = team.full_name;
  const playerHeight =
    height_feet === null ? 'N/A' : `${height_feet}'${height_inches}"`;
  const playerWeight = weight_pounds === null ? 'N/A' : `${weight_pounds} lbs`;

  const nameHeader = document.createElement('h1');
  nameHeader.textContent = playerName;
  playerHeader.appendChild(nameHeader);

  const playerInfo = document.createElement('p');
  playerInfo.innerHTML = `${playerTeam} • ${playerPosition} • ${playerHeight}, ${playerWeight}`;
  playerDescription.appendChild(playerInfo);
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
        showError('Not found: Please try your search again.');
        return;
      }
      // Clear previous search data
      playerHeader.innerHTML = '';
      playerDescription.innerHTML = '';

      // Fetch player info and display to DOM
      const player = data.data[0];
      displayPlayerInfo(player);

      // Fetch stats using player id
      const playerId = player.id;

      fetch(statsUrl + `?season=2023&player_ids[]=${playerId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.data || data.data.length === 0) {
            showError('Player stats not found.');
            return;
          }

          const ppg = data.data[0].pts;
          const apg = data.data[0].ast;
          const rpg = data.data[0].reb;
          const fg = (data.data[0].fg_pct * 100).toFixed(1) + '%';

          // Do something with the stats - will refactor this later
        })
        .catch((error) => {
          console.error('Error fetching player stats:', error);
          showError('Error fetching player stats. Please try again.');
        });
    })
    .catch((error) => {
      console.error('Error fetching player:', error);
      showError('Error fetching player. Please try again.');
    })
    .finally(() => {
      searchBox.value = '';
    });
};

// Display error message
const showError = (message) => {
  const errorMsg = document.createElement('p');
  errorMsg.innerHTML = message;
  errorMsg.classList.add('error');
  playerHeader.appendChild(errorMsg);
};

// Accept enter key
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
