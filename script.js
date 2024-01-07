document.getElementById('searchButton').addEventListener('click', searchMovies);

let api_key = '7410aabfabdbfba105cf4edddfc5fbc7';
let urlBase = 'https://api.themoviedb.org/3/search/movie';
let urlImg = 'https://image.tmdb.org/t/p/w200';

let resultContainer = document.getElementById('results');

let totalResults = 0;
let currentPage = 1;
const apiResultsPerPage = 20; 

function setupPagination(totalMovies) {
    const pageCount = Math.ceil(totalMovies / apiResultsPerPage);
    const paginationUl = document.getElementById('pagination');
    paginationUl.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) li.classList.add('active');

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = i;
            searchMovies(false);
        });

        li.appendChild(a);
        paginationUl.appendChild(li);
    }
}

function searchMovies(isNewSearch = true) {
    if (isNewSearch) {
        currentPage = 1;
    }
    resultContainer.innerHTML = 'Cargando...';
    let searchInput = document.getElementById('searchInput').value;
    fetch(`${urlBase}?api_key=${api_key}&query=${searchInput}&page=${currentPage}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red o respuesta no válida');
        }
        return response.json();
    })
    .then(response => {
        totalResults = response.total_results;
        displayMovies(response.results);
        setupPagination(totalResults); // Solo pasar totalResults
    })
    
    .catch(error => {
        console.error('Error al realizar la petición:', error);
        resultContainer.innerHTML = '<p>Hubo un error al realizar la búsqueda.</p>';
    });
}

function displayMovies(movies) {
    resultContainer.innerHTML = '';

    if (movies.length === 0) {
        resultContainer.innerHTML = '<p class="no-results">No se encontraron resultados para tu búsqueda </p>';
        return;
    }

    movies.forEach(movie => {
        let movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        let title = document.createElement('h2');
        title.textContent = movie.title;

        let releaseDate = document.createElement('p');
        releaseDate.textContent = 'La fecha de lanzamiento fue: ' + movie.release_date;

        let overview = document.createElement('p');
        overview.textContent = movie.overview;

        let posterPath = urlImg + movie.poster_path;
        let poster = document.createElement('img');
        poster.src = posterPath;

        movieDiv.appendChild(poster);
        movieDiv.appendChild(title);
        movieDiv.appendChild(releaseDate);
        movieDiv.appendChild(overview);

        resultContainer.appendChild(movieDiv);
    });
}
