const apiKeyTMDB = "739247f017103c86b22aeb2f3facd9d3"; // TMDb API Key
const apiKeyOMDb = "14d06746"; // OMDb API Key
const imgURL = "https://image.tmdb.org/t/p/w1280";

// Fetch movie details from TMDb, including images
async function fetchMovieDetailsFromTMDB(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKeyTMDB}&append_to_response=credits,images`;
    const response = await fetch(url);
    return response.json();
}

// Fetch movie details from OMDb
async function fetchMovieDetailsFromOMDb(title) {
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKeyOMDb}`;
    const response = await fetch(url);
    return response.json();
}

// Fetch movie details from Wikipedia
async function fetchMovieDetailsFromWikipedia(title) {
    const possibleTitles = [
        `${title} (Bollywood film)`,
        `${title} (${new Date().getFullYear()} film)`,
        `${title} (film)`
    ];
    
    for (const bollywoodTitle of possibleTitles) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(bollywoodTitle)}&explaintext=1&exintro=1&piprop=original&origin=*`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            const page = Object.values(data.query.pages)[0];
            
            if (page && page.extract) {
                return {
                    extract: page.extract,
                    image: page.original ? page.original.source : null,
                };
            }
        } catch (error) {
            console.error("Error fetching data from Wikipedia:", error);
        }
    }

    return { extract: "No additional details available.", image: null };
}

// Display movie details on the page
function displayMovieDetails(movie, wiki, omdb) {
    const movieDetailContainer = document.getElementById("movie-detail");
    const cast = movie.credits.cast.slice(0, 5).map(actor => `<li>${actor.name} as ${actor.character}</li>`).join('');
    const crew = movie.credits.crew.slice(0, 5).map(member => `<li>${member.name} - ${member.job}</li>`).join('');
    
    // Main poster image
    const posterImage = movie.poster_path ? `${imgURL}${movie.poster_path}` : '';
    
    // Movie screenshots (backdrops)
    const screenshots = movie.images.backdrops.slice(0, 3).map(
        (backdrop) => `<img src="${imgURL}${backdrop.file_path}" alt="Screenshot of ${movie.original_title}" class="screenshot" />`
    ).join('');

    const content = `
        <h1>${movie.original_title} (${new Date(movie.release_date).getFullYear()}) - Filmy4wap</h1>
        <img src="${posterImage}" alt="Poster of ${movie.original_title}" class="poster-image" />
        
        <p><strong>Overview:</strong> ${movie.overview || wiki.extract || 'No overview available.'}</p>

        <!-- Table for movie details -->
        <table>
            <tr><th>Title</th><td>${movie.original_title}</td></tr>
            <tr><th>Genre</th><td>${movie.genres.map(g => g.name).join(', ')}</td></tr>
            <tr><th>Cast</th><td><ul>${cast || '<li>No cast information available.</li>'}</ul></td></tr>
            <tr><th>Director</th><td>${movie.credits.crew.find(c => c.job === 'Director')?.name || 'N/A'}</td></tr>
            <tr><th>Written By</th><td>${movie.credits.crew.find(c => c.job === 'Screenplay')?.name || 'N/A'}</td></tr>
            <tr><th>Votes</th><td>${movie.vote_count}</td></tr>
            <tr><th>Popularity</th><td>${movie.popularity}</td></tr>
            <tr><th>Release Date</th><td>${new Date(movie.release_date).toLocaleDateString()}</td></tr>
            <tr><th>Rating</th><td>${movie.vote_average}</td></tr>
            <tr><th>Runtime</th><td>${movie.runtime} minutes</td></tr>
            <tr><th>Home</th><td>Filmy4wap</td></tr>
        </table>

        <h2>Plot Details</h2>
        <p>${omdb.Plot || "No plot details available."}</p>

        <h2>Review & Ratings</h2>
        <p><strong>User Ratings:</strong> ${movie.vote_average} / 10</p>
        <p><strong>User Votes:</strong> ${movie.vote_count}</p>

        <h2>Movie Screenshots</h2>
        <div class="screenshots">${screenshots || '<p>No screenshots available.</p>'}</div>

        <h2>Additional Information</h2>
        <p>${wiki.extract}</p>

        <h2>FAQs</h2>
        <p>Check out frequently asked questions on Filmy4wap.</p>
    `;
    
    movieDetailContainer.innerHTML = content;
}

// Initialize the movie detail page
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) {
        const movieData = await fetchMovieDetailsFromTMDB(movieId);
        const wikiData = await fetchMovieDetailsFromWikipedia(movieData.original_title);
        const omdbData = await fetchMovieDetailsFromOMDb(movieData.original_title);
        displayMovieDetails(movieData, wikiData, omdbData);
    }
}

init();
