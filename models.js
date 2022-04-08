const mongoose = require("mongoose");

//Defining the Schema in both my data collections

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});
  
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }]
});

//Creation of the Models - they use the schemas defined above

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

//Those two lines are needed to export my two models to index.js file

module.exports.Movie = Movie;
module.exports.User = User;
