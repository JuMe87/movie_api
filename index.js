//imports the express module locally so it can be used within the file
const express = require('express');
//second line declares a variable that encapsulates Express’s functionality to configure your web server. This new variable is what you’ll use to route your HTTP requests and responses.
const app = express();

const port = 8080

// Import Morgan middleware library
const morgan = require('morgan');

// Log basic request data in terminal using Morgan middleware library
app.use(morgan('common'));

let topMovies = [
    {
      title: "Harry Potter and the Philosopher's Stone",
      director: "Chris Columbus"
    },
    {
      title: "Lord of the Rings: The Fellowship of the Ring",
      director: "Peter Jackson"
    },
    {
      title: "Twilight",
      director: "Catherine Hardwicke"
    },
    {
      title: "The Matrix",
      director: "Lana Wachowski, Lilly Wachowski"
    },
    {
        title: "Titanic",
        director: "James Cameron"
    },
    {
        title: "Forrest Gump",
        director: "Robert Zemeckis"
    },
    {
        title: "The Lion King",
        director: "Roger Allers, Rob Minkoff"
    },
    {
        title: "C'era una volta il West",
        director: "Sergio Leone"
    },
    {
        title: "Avengert: Infinity War",
        director: "Anthony Russo, Joe Russo"
    },
    {
        title: "Inglourious Basterds",
        director: "Quention Tarantino"
    }
];
  
// GET Welcome message for '/' request URL
app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

// GET topMovies JSON for '/movies' request URL
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Serve static content for the app from the 'public' directory
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(port, () => {
    console.log('Your app is listening on port 8080.');
});