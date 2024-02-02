# Movie Search Application

This application enables users to search for movies by name and view detailed information, including ratings, year of release, runtime, genre, plot, and cast. It leverages the OMDb API to fetch movie data and dynamically displays it on the page.

## Features

- **Search Functionality**: Users can search for movies by entering a movie name and clicking the search button or pressing Enter.
- **Dynamic Results Display**: Displays movie posters, titles, ratings, details, and plots dynamically based on search results.
- **Pagination**: Supports pagination to navigate through multiple search results efficiently.
- **Responsive Design**: Utilizes basic CSS for a responsive layout, ensuring compatibility across different devices and screen sizes.

## How It Works

The application's core functionality is implemented in JavaScript. Here's a brief overview:

- The `DOMContentLoaded` event listener ensures the script runs after the full HTML document has been loaded.
- Event listeners on the search input field and button trigger the `getMovie` function, which constructs a URL to query the OMDb API based on the user's input.
- Movie details are fetched in parallel using `Promise.all`, sorted by year, and then displayed in the `result` div.
- The `setupPagination` function calculates the number of pages based on total search results and creates pagination buttons dynamically.

## Setup

1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser to run the application.
3. Ensure you have an internet connection to fetch data from the OMDb API.

## External Dependencies

- **OMDb API**: The application requires an API key from OMDb for fetching movie data. Store your API key in the `key.js` file.

## Contribution

Contributions are welcome! If you have suggestions for improvements or bug fixes, please:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes.
4. Push to your branch.
5. Submit a pull request.