// Imports the express module locally so it can be used within the file
const express = require('express');
// Second line declares a variable that encapsulates Express’s functionality to configure your web server. This new variable is what you’ll use to route your HTTP requests and responses.
const app = express();

const port = 8080

// Imports middleware libraries: Morgan, body-parser and uuid
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

// Log basic request data in terminal using Morgan middleware library
app.use(morgan('common'));

// Use body-parser middleware function
app.use(bodyParser.json());

// Array of objects that contain movie data
let movies = [
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

// Create array of objects that holds data about genres
let genres = [
    {
      genre_name: 'Drama',
      description: 'The drama genre features stories with high stakes and a lot of conflicts. They are plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters.'
    },
    {
      genre_name: 'Fantasy',
      description: 'Fantasy is a genre of literature that features magical and supernatural elements that do not exist in the real world. Speculative in nature, fantasy is not tied to reality or scientific fact.'
    },
    {
      genre_name: 'Action',
      description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    }
];
  
// Create array of objects that holds data about directors
let directors = [
    {
      director_name: 'James Cameron',
      birth_year: 1954,
      bio: 'xyz'
    },
    {
      director_name: 'Chris Columbus',
      birth_year: 1958,
      bio: 'abc'
    },
    {
      direcor_name: 'James Gunn',
      birth_year: 1966,
      bio: 'def'
    }
];
  
//Create array of objects that holds data about users
let users = [];

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.json(movies);
});
  
// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
      return movie.title === req.params.title;
    }));
});
  
// Return data about a genre (description) by name/title (e.g., “Fantasy”)
app.get('/genres/:genre_name', (req, res) => {
    res.json(genres.find((genre) => {
      return genre.genre_name === req.params.genre_name;
    }));
});
  
// Return data about a director (bio, birth year, death year) by name
app.get('/directors/:director_name', (req, res) => {
    res.json(directors.find((director) => {
      return director.director_name === req.params.director_name;
    }));
});
  
// Allow new users to register
app.post('/users', (req, res) => {
    let newUser = req.body; // using body-parser to get request body in JSON format
  
    if(!newUser.user_name){ // If the user_name is missing, return error message
      res.status(400).send('Missing user name in request body!');
    } else { // Create uuid and add new user to the user list
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).send('Your profile with the user name ' + req.body.user_name + ' was successfully created!');
    };
});
  
// Return a list of ALL users (only for testing purposes)
app.get('/users', (req, res) => {
    res.json(users);
});
  
// Allow users to update their user info (username)
app.put('/users/:email/:user_name', (req, res) => {
    // Find the user with the corresponding email
    let user = users.find((user) => {
      return user.email === req.params.email;
    });
  
    if(user){ // if a user could be found, change user name
      user.user_name = req.params.user_name;
      res.status(201).send('Your username was successfully updated to: ' + req.params.user_name);
    } else { // else, return error message
      res.status(404).send('User with mail address ' + req.params.email + ' was not found.');
    };
});
  
// Allow users to add a movie to their list of favorites
app.post('/users/:email/favorites/:title', (req, res) => {
    // Find the user with the corresponding email
    let user = users.find((user) => {
      return user.email === req.params.email;
    });
  
    if(user){ // If a user with the email address exists
      if (!user.favorites) { // Check if user already has a list of favorites, if not, add element to user object
        user["favorites"] = [];
      };
      user.favorites.push(req.params.title); // Add title to list of favorites
      res.status(201).send('Movie with the title ' + req.params.title + ' was successfully added to your list of favorites!');
    } else { // If user cannot be found, return error
      res.status(404).send('User with the email ' + req.params.email + ' was not found.');
    };
});
  
// Allow users to remove a movie from their list of favorites
app.delete('/users/:email/favorites/:title', (req, res) => {
    // Find the user with the corresponding email
    let user = users.find((user) => {
      return user.email === req.params.email;
    });
  
    if(user){ // If a user with the email address exists
      let index = user.favorites.indexOf(req.params.title);
      if (index > -1){
        user.favorites.splice(index, 1);
        res.status(201).send('Movie with the title ' + req.params.title + " was successfully deleted from your list.");
      } else {
        res.status(404).send('Movie not found in list of favorites.');
      }
    } else { // If user cannot be found, return error
      res.status(404).send('User with the email ' + req.params.email + ' was not found.');
    };
});
  
// Allow existing users to deregister
app.delete('/users/:email', (req, res) => {
    // Find the user with the corresponding email
    let user = users.find((user) => {
      return user.email === req.params.email;
});
  
if (user) { // If a user with the email address exists
      // delete the user object from the array
      users = users.filter((obj) => {
        return obj.email != req.params.email;
      });
      // Send response message
      res.status(201).send('User with the email ' + req.params.email + ' was sucessfully deleted.');
    } else { // If user cannot be found, return error
      res.status(404).send('User with the email ' + req.params.email + ' was not found.');
    };
});

// GET Welcome message for '/' request URL
app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

// Serve static content for the app from the 'public' directory
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broke!');
  });

// listen for requests
app.listen(port, () => {
    console.log('Your app is listening on port 8080.');
});