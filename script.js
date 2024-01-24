const searchBox = document.getElementById('searchBox');
const statsDiv = document.getElementById('stats');
const playerHeader = document.getElementById('player-header');
const playerDescription = document.getElementById('player-description');
const playerStats = document.getElementById('player-stats');

// API endpoints
const playerUrl = 'https://www.balldontlie.io/api/v1/players/';
const statsUrl = 'https://www.balldontlie.io/api/v1/season_averages';

// Fetch player on search
const search = () => {
  if (searchBox.value === '' || searchBox.value === ' ') {
    alert('Please enter a player.');
  } else {
    fetch(playerUrl + `?search=${searchBox.value}`)
      .then((response) => response.json())
      .then((data) => {
        // Clear previous search data
        playerHeader.innerHTML = '';
        playerDescription.innerHTML = '';

        // Store player data from API
        const playerId = data.data[0].id;
        const playerName =
          data.data[0].first_name + ' ' + data.data[0].last_name;
        const playerPosition =
          data.data[0].position === '' ? 'N/A' : data.data[0].position;
        const playerTeam = data.data[0].team.full_name;
        const playerHeight =
          data.data[0].height_feet === null
            ? 'N/A'
            : data.data[0].height_feet + "'" + data.data[0].height_inches;
        const playerWeight =
          data.data[0].weight_pounds === null
            ? 'N/A'
            : data.data[0].weight_pounds + ' lbs';

        // Display player information
        const nameHeader = document.createElement('h1');
        nameHeader.innerHTML = playerName;
        playerHeader.appendChild(nameHeader);

        const playerInfo = document.createElement('p');
        playerInfo.innerHTML =
          playerTeam +
          ' • ' +
          playerPosition +
          ' • ' +
          playerHeight +
          ', ' +
          playerWeight;
        playerDescription.appendChild(playerInfo);

        console.log(data.data);

        // Fetch player stats from id
        fetch(statsUrl + `?season=2023&player_ids[]=${playerId}`)
          .then((response) => response.json())
          .then((data) => {
            // Store player stats from API
            const ppg = data.data[0].pts;
            const apg = data.data[0].ast;
            const rpg = data.data[0].reb;
            const fg = (data.data[0].fg_pct * 100).toFixed(1) + '%';

            console.log(data);
          })
          .catch((error) => {
            console.error('Error:', error);

            const errorMsg = document.createElement('p');
            errorMsg.innerHTML = 'Not found: Please try your search again.';
            errorMsg.classList.add('error');
            playerHeader.appendChild(errorMsg);
          });
      });
    searchBox.value = '';
  }
};

// Accept enter key
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
