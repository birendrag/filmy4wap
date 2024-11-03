const apiKey = "739247f017103c86b22aeb2f3facd9d3"; // TMDb API Key
const imgURL = "https://image.tmdb.org/t/p/w1280";
const baseURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&language=hi&with_original_language=hi&region=IN&primary_release_year=2024`;
const searchURL = `https://api.themoviedb.org/3/search/movie?&api_key=${apiKey}&language=hi&query=`;
const form = document.getElementById("search-form");
const query = document.getElementById("query");
const root = document.getElementById("root");
let page = 1;
let inSearchPage = false;

// Fetch JSON data from URL
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Fetch and display results
const fetchAndShowResults = async (url) => {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results);
    }
}

// Show results in the DOM
const showResults = (items) => {
    let content = '';
    items.forEach(item => {
        const { id, poster_path, original_title, release_date } = item;
        content += `
            <div class="card">
                <img src="${poster_path ? imgURL + poster_path : 'placeholder-image-url'}" alt="${original_title}" />
                <div class="card-content">
                    <h4>${original_title.length > 18 ? original_title.slice(0, 18) + '...' : original_title}</h4>
                    <span>${formatDate(release_date)}</span>
                    <a href="movie-detail.html?id=${id}" class="btn">Show More</a>
                </div>
            </div>
        `;
    });

    // Update the root element with the content
    root.innerHTML = `<div class="grid">${content}</div>`;
}

// Format date
const formatDate = (dateString) => {
    if (!dateString) return "No release date";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Handle search form submission
form.addEventListener("submit", async (e) => {
    inSearchPage = true;
    e.preventDefault();
    const searchTerm = query.value;
    if (searchTerm) {
        page = 1; // Reset page number for new search
        root.innerHTML = ""; // Clear previous results
        fetchAndShowResults(searchURL + encodeURIComponent(searchTerm) + "&with_original_language=hi&region=IN");
    }
    query.value = "";
});

// Initialize the page with the latest Bollywood (Hindi) movies
function init() {
    fetchAndShowResults(`${baseURL}&page=${page}`);
}

// Start the app
init();
