const searchBox = document.getElementById('searchBox');

// Search functionality
const search = () => {
  if (searchBox.value === '' || searchBox.value === ' ') {
    alert('Please enter a team or player.');
  } else {
    console.log(searchBox.value);
    searchBox.value = '';
  }
};

// Accept enter key
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
