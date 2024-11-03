// Server-side (Node.js) code - server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/tmdb/:query', async (req, res) => {
    const apiKey = '739247f017103c86b22aeb2f3facd9d3';
    const url = `https://api.themoviedb.org/3/${req.params.query}&api_key=${apiKey}`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
