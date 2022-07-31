# Achievement 2 Project:  myFlix  - movie_api

## Table of Contents

-   [Objective](#Objective)
-   [Design Criteria](#Design-criteria)
-   [Technical Requirements](#Technical-Requirements)
-   [Setup](#setup)
-   [Development Process of the Server-Side](#development-process-of-the-server-side)
-   [Data Security](#data-security)
-   [Hosting on HEROKU (PaaS) and MongoDBAtlas (DBaaS)](#hosting-on-heroku-paas-and-mongodbatlas-dbaas)

## Objective

To build the server-side component of a “movies” web application. The web  application will provide users with access to information about different  movies, directors, and genres. Users will be able to sign up, update their  personal information, and create a list of their favorite movies.

## Design Criteria

### User Stories

-   As a user, I want to be able to receive information on movies, directors, and genres so that I  can learn more about movies I’ve watched or am interested in.
-   As a user, I want to be able to create a profile so I can save data about my favorite movies.

### Feature Requirements

-   Return a list of ALL movies to the user
-   Return data (description, genre, director, image URL, whether it’s featured or not) about a  single movie by title to the user
-   Return data about a genre (description) by name/title (e.g., “Thriller”)
-   Return data about a director (bio, birth year, death year) by name
-   Allow new users to register
-   Allow users to update their user info (username, password, email, date of birth)  -
-   Allow users to add a movie to their list of favorites
-   Allow users to remove a movie from their list of favorites
-   Allow existing users to deregister

## Technical Requirements

-   The API must be a Node.js and Express application.
-   The API must use REST architecture, with URL endpoints corresponding to the data  operations listed above
-   The API must use at least three middleware modules, such as the body-parser package for  reading data from requests and morgan for logging.
-   The API must use a “package.json” file.
-   The database must be built using MongoDB.
-   The business logic must be modeled with Mongoose.
-   The API must provide movie information in JSON format.
-   The JavaScript code must be error-free.
-   The API must be tested in Postman.
-   The API must include user authentication and authorization code.
-   The API must include data validation logic.
-   The API must meet data security regulations.
-   The API source code must be deployed to a publicly accessible platform like GitHub.
-   The API must be deployed to Heroku.

## Setup

1. Clone or download repository ...

```bash
git clone https://github.com/JuMe87/movie_api.git
```

3. install mongodb

```bash
npm install mongodb
```

4. Connect with own MongoDB (local or external)
   define CONNECTION_URI as environment variable, otherwise it will connect to mongodb://localhost:27017/test

5. start the server

```bash
npm run start
```

## Development Process of the Server-Side

### Installation of node.js and express

### Documentation

Open this link to see a documentation of the used endpoints:

https://julesmyflixdb.herokuapp.com/documentation.html

### Installation of all dev dependencies and express middleware for development

See the dependencies listed in the package.json:

**See the package.json file**

### Create and populate non-relational database MongoDB

-   use database schema diagram to sketch structure of database, division into two collections ("movies" and "users").
-   installing mongo shell
-   use Mongo Shell to create database with CRUD operations
-   Create the 2 collections "movies" and "users".
-   Add 10 documents to the "movies" collection (including embedded documents for the keys "genre" and "director").
-   In the "users" collection - consisting of 4 documents - references are used to store information about the user's favorite movies.

### Building models with Mongoose (Business Logic)

Use Mongoose to build the Business Logic Layer linking the database from MongoDB to the server (and finally to the Web Browser).

Process:

-   Installation of object model driver Mongoose
-   Installation of dependencies: jsonwebtoken (jwt), bcrypt
-   Configuring the schemata for the users and the movies collection
-   Creation of the Models in a separate models.js file
-   Exporting the models to index.js
-   Rewriting the CRUD operations to query the mongoose models
-   Integrating Mongoose with the REST API
-   Apply local and jwt authentication methods
-   Test the endpoints in Postman

## Data Security

### Authentication in Node.js/Express using Passport

-   Implement basic HTTP authentication for initial login requests
-   implement login query with generation of JWT token

### Implementation of Security Measures for Backend

-   CORS in Express (set to allow for all origins)
-   Bcrypt for Password hashing

## Hosting on HEROKU (PaaS) and MongoDBAtlas (DBaaS)

### Installing HEROKU

1. Sign up for a free Heroku account: https://dashboard.heroku.com/apps
2. Install the Heroku Toolbelt as explained in the Heroku tutorial. Only complete the steps listed on the “Set-Up” page (the initial installation and the heroku login command in your terminal).
3. Update your “package.json” file to include “start” script. To do so, open your “package.json” file in your text editor and under the scripts section, add the following code: "start": "node index.js".
4. If you already have a “test” script listed, you can either replace it with your new “start” script or add your start script underneath it (though make sure you add a comma at the end of the “test” script to separate them).
5. Update your current app.listen(); function as follows:
   `const port = process.env.PORT || 8080; app.listen(port, '0.0.0.0',() => { console.log('Listening on Port ' + port); });`
6. Save all the changes you’ve made to your files and commit/push the changes to your GitHub repository using GitHub Desktop. Then, open the terminal and navigate to your project folder. Once inside it, create an app on Heroku by running the command heroku create from your project directory. This creates a new empty project on Heroku with a randomly assigned name and URL such as “http://warm-wave-1943.herokuapp.com.”
7. Send your application to Heroku using Git in the terminal. You’ll do so using a Git command called `git push`. The command you’ll want to enter is `git push heroku main`. This command tells Heroku to grab a copy of your committed code and use it to deploy your site on Heroku.
8. Once this command is finished, the server will restart with the latest code and your site will be launched.

### Installing MongoDB Atlas

1. You’ll first need to sign up for a MongoDB Atlas account.
2. Select the free plan by clicking on the Create a cluster button. You’ll be redirected to the Create Cluster screen.
3. Select one of the available cloud providers.
4. Pick a region that’s in the same country as (or the one that’s closest to) the location of your Heroku app server.
5. Make sure that M0 Cluster is selected (the one that has “Free forever” in its “Base Price” column) in the Cluster Tier panel.
6. Once done, leave everything else (Additional Settings) as-is except for the Cluster Name at the bottom of the page. Name it whatever you want! In the example below, the name “myFlixDB” has been used, but since you may want to use this cluster for other databases in the future, use a more general name if you’d like.
7. Afterwards, you’ll be redirected to the dashboard. You’ll see blue-highlighted notice indicating that your cluster is being deployed.
