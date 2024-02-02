document.addEventListener('DOMContentLoaded', (event) => {
    let movieNameRef = document.getElementById("movie-name");
    let searchBtn = document.getElementById("search-btn");
    let result = document.getElementById("result");
    let pagination = document.getElementById("pagination");
    let currentPage = 1;
    let totalResults = 0;
    const resultsPerPage = 10; // Assuming 10 results per page
    const maxVisiblePages = 5; // Maximum number of visible pages at once

    movieNameRef.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            getMovie(currentPage);
        }
    });

    let getMovie = (page) => {
        result.innerHTML = `<h3 class="loading-message">Loading movies...</h3>`;
        result.classList.add('fadeIn');
        let movieName = movieNameRef.value.trim();
        let url = `https://www.omdbapi.com/?s=${encodeURIComponent(movieName)}&apikey=${key}&page=${page}`;

        if (movieName.length <= 0) {
            result.innerHTML = `<h3 class="msg">Please enter a movie name.</h3>`;
            pagination.innerHTML = '';
            return;
        }

        fetch(url).then((resp) => resp.json()).then((data) => {
            if (data.Response == "True") {
                totalResults = parseInt(data.totalResults);
                let movieDetailsPromises = data.Search.map(movie => fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${key}`)
                    .then(response => response.json()));

                Promise.all(movieDetailsPromises).then(details => {
                    // Ordenar las películas por año de forma descendente
                    let sortedDetails = details.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

                    // Actualizar el DOM con las películas ordenadas
                    result.innerHTML = sortedDetails.map(detail => `
                        <div class="info">
                            <img src="${detail.Poster}" class="poster">
                            <div class="info-movie">
                                <h2>${detail.Title}</h2>
                                <div class="rating">
                                    <img src="star-icon.svg" alt="Star icon">
                                    <h4>${detail.imdbRating}</h4>
                                </div>
                                <div class="details">
                                    <span>${detail.Rated}</span>
                                    <span>${detail.Year}</span>
                                    <span>${detail.Runtime}</span>
                                </div>
                                <div class="genre">${detail.Genre.split(',').map(genre => `<div>${genre.trim()}</div>`).join('')}</div>
                                <h3>Plot:</h3>
                                <p>${detail.Plot}</p>
                                <h3>Cast:</h3>
                                <p>${detail.Actors}</p>
                            </div>
                        </div>
                    `).join('');
                    setupPagination(totalResults);
                    result.classList.add('fadeIn');
                });
            } else {
                result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
                pagination.innerHTML = '';
            }
        }).catch((error) => {
            result.innerHTML = `<h3 class="msg">Error Occurred: ${error.message}</h3>`;
            pagination.innerHTML = '';
        });
    };

    function setupPagination(totalMovies) {
        const pageCount = Math.ceil(totalMovies / resultsPerPage);
        pagination.innerHTML = '';

        let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, pageCount);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        if (startPage > 1) {
            addPaginationItem(pagination, 1, '<<');
        }

        if (currentPage > 1) {
            addPaginationItem(pagination, currentPage - 1, '<');
        }

        for (let i = startPage; i <= endPage; i++) {
            addPaginationItem(pagination, i, i);
        }

        if (currentPage < pageCount) {
            addPaginationItem(pagination, currentPage + 1, '>');
        }

        if (endPage < pageCount) {
            addPaginationItem(pagination, pageCount, '>>');
        }
    }

    function addPaginationItem(container, page, text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = page;
            getMovie(currentPage);
        });

        if (page === currentPage) {
            button.classList.add('active'); // Add an 'active' class or disable the button
        }

        container.appendChild(button);
    }

    searchBtn.addEventListener("click", () => getMovie(currentPage));
});
