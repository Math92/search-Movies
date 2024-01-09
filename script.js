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

    const maxVisiblePages = 5; // Máximo de páginas visibles a la vez
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, pageCount);

    // Asegurar que siempre haya maxVisiblePages páginas visibles
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    // Botón para ir a la primera página
    if (startPage > 1) {
        addPaginationItem(paginationUl, 1, '<<');
    }

    // Botón para ir a la página anterior
    if (currentPage > 1) {
        addPaginationItem(paginationUl, currentPage - 1, '<');
    }

    // Números de página
    for (let i = startPage; i <= endPage; i++) {
        addPaginationItem(paginationUl, i, i);
    }

    // Botón para ir a la página siguiente
    if (currentPage < pageCount) {
        addPaginationItem(paginationUl, currentPage + 1, '>');
    }

    // Botón para ir a la última página
    if (endPage < pageCount) {
        addPaginationItem(paginationUl, pageCount, '>>');
    }
}

function addPaginationItem(container, page, text) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    if (page === currentPage) {
        li.classList.add('active');
    }

    const a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.textContent = text;
    a.addEventListener('click', function (e) {
        e.preventDefault();
        currentPage = page;
        searchMovies(false);
    });

    li.appendChild(a);
    container.appendChild(li);
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

        let posterPath = urlImg + movie.poster_path;
        let poster = document.createElement('img');
        poster.src = posterPath;

        movieDiv.appendChild(poster);
        movieDiv.appendChild(title);
        movieDiv.appendChild(releaseDate);

        resultContainer.appendChild(movieDiv);
    });
}
