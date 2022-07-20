// Load express framework
const express = require("express")
const app = express()

// Import middleware libraries: Morgan, body-parser, and uuid
const morgan = require("morgan")
const bodyParser = require("body-parser")
const uuid = require("uuid")

// Use body-parser middleware function
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Uses CORS within my application
const cors = require("cors")
app.use(cors())

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*")
    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "*")
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "*")
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true)
    // Pass to next layer of middleware
    next()
})

// Import express-validator to validate input fields
const { check, validationResult } = require("express-validator")

//Imports auth.js file into project
let auth = require("./auth")(app)

//Used Passport module and imports passport.js file
const passport = require("passport")
require("./passport")

// Import Mongoose, models.js and respective models
const mongoose = require("mongoose")
const Models = require("./models.js")

// This is required for my REST API to perform CRUD operations on my MongoDB Data
const Movies = Models.Movie
const Users = Models.User

// Connection to port 8080
const port = process.env.PORT || 8080

// Connecting to MongoDB myFlixDB
//mongoose.connect("mongodb://localhost:27017/myFlixDB", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Log basic request data in terminal using Morgan middleware library
app.use(morgan("common"))

// Default welcome message when at "/"
app.get("/", (req, res) => {
    res.send("Welcome to myFlix!")
})

// Return a list of ALL users
// app.get(
//     "/users",
//     passport.authenticate("jwt", { session: false }),
//     (req, res) => {
//         Users.find()
//             .then((users) => {
//                 res.status(201).json(users)
//             })
//             .catch((err) => {
//                 console.error(err)
//                 res.status(500).send("Error: " + err)
//             })
//     }
// )

app.get(
    "/movies",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.find()
            .then(function (movies) {
                res.status(201).json(movies)
            })
            .catch(function (error) {
                console.error(error)
                res.status(500).send("Error: " + error)
            })
    }
)

// Get a user by username
app.get(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOne({ Username: req.params.Username })
            .then((user) => {
                res.json(user)
            })
            .catch((err) => {
                console.error(err)
                res.status(500).send("Error: " + err)
            })
    }
)

// Get a movie by title
app.get(
    "/movies/:Title",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.findOne({ Title: req.params.Title })
            .then((movie) => {
                res.json(movie)
            })
            .catch((err) => {
                console.error(err)
                res.status(500).send("Error: " + err)
            })
    }
)

// Get genre info when looking for specific genre
app.get(
    "/movies/genre/:Name",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.findOne({ "Genre.Name": req.params.Name }) // Find one movie with the genre by genre name
            .then((movie) => {
                if (movie) {
                    // If a movie with the genre was found, return json of genre info, else throw error
                    res.status(200).json(movie.Genre)
                } else {
                    res.status(400).send("Genre not found")
                }
            })
            .catch((err) => {
                res.status(500).send("Error: " + err)
            })
    }
)

// Get info on director when looking for specific director
app.get(
    "/movies/director/:Name",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.findOne({ "Director.Name": req.params.Name }) // Find one movie with the director by name
            .then((movie) => {
                if (movie) {
                    // If a movie with the director was found, return json of director info, else throw error
                    res.status(200).json(movie.Director)
                } else {
                    res.status(400).send("Director not found")
                }
            })
            .catch((err) => {
                res.status(500).send("Error: " + err)
            })
    }
)

// Allow new users to register
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

//Add a user
app.post(
    "/users",
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check("Username", "Username is required").isLength({ min: 5 }),
        check(
            "Username",
            "Username contains non alphanumeric characters - not allowed."
        ).isAlphanumeric(),
        check("Password", "Password is required").not().isEmpty(),
        check("Email", "Email does not appear to be valid").isEmail(),
    ],
    (req, res) => {
        // check the validation object for errors
        let errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        let hashedPassword = Users.hashPassword(req.body.Password)
        Users.findOne({ Username: req.body.Username }) //Mongoose findOne command
            .then((user) => {
                if (user) {
                    return res
                        .status(400)
                        .send(req.body.Username + "already exists")
                } else {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                    })
                        .then((user) => {
                            res.status(201).json(user)
                        })
                        .catch((error) => {
                            //error handling function
                            console.error(error)
                            res.status(500).send("Error: " + error)
                        })
                }
            })
            .catch((error) => {
                console.error(error)
                res.status(500).send("Error: " + error)
            })
    }
)

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    // Validation logic
    [
        check("Username", "Username is required (min 5 characters).").isLength({
            min: 5,
        }),
        check(
            "Username",
            "Username contains non alphanumeric characters - not allowed."
        ).isAlphanumeric(),
    ],
    (req, res) => {
        // Check validation object for errors
        let errors = validationResult(req)
        let hashedPassword = undefined

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        // If Password is given in request body, create hashedPassword from given Password
        if (req.body.hasOwnProperty("Password")) {
            hashedPassword = Users.hashPassword(req.body.Password)
        }

        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    Password: hashedPassword, // Stores only hashed password
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                },
            },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err)
                    res.status(500).send("Error: " + err)
                } else {
                    res.json(updatedUser)
                }
            }
        )
    }
)

// Add a movie to a user's list of favorites
app.post(
    "/users/:Username/movies/:MovieID",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $push: { FavoriteMovies: req.params.MovieID } },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err)
                    res.status(500).send("Error: " + err)
                } else {
                    res.json(updatedUser)
                }
            }
        )
    }
)

// Remove a movie from user's list of favorite movies
app.delete(
    "/users/:Username/movies/:MovieID",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $pull: { FavoriteMovies: req.params.MovieID } },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err)
                    res.status(500).send("Error: " + err)
                } else {
                    res.json(updatedUser)
                }
            }
        )
    }
)

// Delete a user by username
app.delete(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username })
            .then((user) => {
                if (!user) {
                    res.status(400).send(req.params.Username + " was not found")
                } else {
                    res.status(200).send(req.params.Username + " was deleted.")
                }
            })
            .catch((err) => {
                console.error(err)
                res.status(500).send("Error: " + err)
            })
    }
)

// Access documentation.html using express.static
app.use("/documentation", express.static("public"))

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something is broke!")
})

// listen for requests
app.listen(port, "0.0.0.0", () => {
    console.log("Listening on Port " + port)
})
