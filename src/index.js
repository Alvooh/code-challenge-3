// API endpoint URL for movies
let url = 'https://api.npoint.io/f8d1be198a18712d3f29/films/';

// DOM element to hold the movie list
const listHolder = document.getElementById('films');

// Function to wait for the DOM to be loaded and then fetch movies
document.addEventListener('DOMContentLoaded', () => {
  document.getElementsByClassName('film item')[0]?.remove(); // Remove potentially existing placeholder element
  fetchMovies(url);
});

// Fetches movies from the API
function fetchMovies(url) {
  fetch(url)
    .then(response => response.json())
    .then(movies => {
      movies.forEach(movie => {
        displayMovie(movie);
      });
    });
}

// Creates and displays an li element for each movie
function displayMovie(movie) {
  const li = document.createElement('li');
  li.style.cursor = "pointer";
  li.textContent = movie.title.toUpperCase();

  // Button to delete a movie
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    deleteMovie(movie.id);
    li.remove();
  });
  li.appendChild(deleteButton);

  listHolder.appendChild(li);
  addClickEvent();
}

// Deletes a movie from the server based on its ID
function deleteMovie(movieId) {
  fetch(`${url}/${movieId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }
      return response.json();
    })
    .then(data => {
      console.log('Movie deleted successfully:', data);
    })
    .catch(error => {
      console.error('Error deleting movie:', error);
    });
}

// Adds click event listeners to each movie list item
function addClickEvent() {
  const children = listHolder.children;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    child.addEventListener('click', () => {
      fetch(`${url}/${i + 0}`)
        .then(res => res.json())
        .then(movie => {
          document.getElementById('buy-ticket').textContent = 'Buy Ticket';
          setUpMovieDetails(movie);
        });
    });
  }
}

// Updates movie details section with fetched movie data
function setUpMovieDetails(childMovie) {
  const preview = document.getElementById('poster');
  preview.src = childMovie.poster;

  const movieTitle = document.querySelector('#title');
  movieTitle.textContent = childMovie.title;
  const movieTime = document.querySelector('#runtime');
  movieTime.textContent = `${childMovie.runtime} minutes`;
  const movieDescription = document.querySelector('#film-info');
  movieDescription.textContent = childMovie.description;
  const showTime = document.querySelector('#showtime');
  showTime.textContent = childMovie.showtime;
  const tickets = document.querySelector('#ticket-num');
  tickets.textContent = childMovie.capacity - childMovie.tickets_sold;
}

// Button element for buying a ticket (simulated)
const btn = document.getElementById('buy-ticket');

btn.addEventListener('click', function (e) {
  let remTickets = document.querySelector('#ticket-num').textContent;
  e.preventDefault(); // Prevent default form submission behavior
  if (remTickets > 0) {
    document.querySelector('#ticket-num').textContent = remTickets - 1;
  } else if (parseInt(remTickets, 10) === 0) {
    btn.textContent = 'Sold Out';
  }
});