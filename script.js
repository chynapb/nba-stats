const searchBox = document.getElementById('searchBox');
const statsDiv = document.getElementById('stats');
const playerHeader = document.getElementById('player-header');
const playerDescription = document.getElementById('player-description');
const playerStats = document.getElementById('player-stats');

// API endpoints
const playerUrl = 'https://www.balldontlie.io/api/v1/players';
const statsUrl = 'https://www.balldontlie.io/api/v1/season_averages';

// Fetch player data
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
        let playerId = data.data[0].id;
        let playerName = data.data[0].first_name + ' ' + data.data[0].last_name;
        let playerPosition =
          data.data[0].position === '' ? 'N/A' : data.data[0].position;
        let playerTeam = data.data[0].team.full_name;
        let playerHeight =
          data.data[0].height_feet === null
            ? 'N/A'
            : data.data[0].height_feet + "'" + data.data[0].height_inches;
        let playerWeight =
          data.data[0].weight_pounds === null
            ? 'N/A'
            : data.data[0].weight_pounds + ' lbs';

        // Display player information
        let nameHeader = document.createElement('h1');
        nameHeader.innerHTML = playerName;
        playerHeader.appendChild(nameHeader);

        let playerInfo = document.createElement('p');
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
      })
      .catch((error) => {
        console.error('Error:', error);

        let errorMsg = document.createElement('p');
        errorMsg.innerHTML = 'Not found: Please try your search again.';
        errorMsg.classList.add('error');
        playerHeader.appendChild(errorMsg);
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
