const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const actors = require('./routers/actor');
const movies = require('./routers/movie');
const app = express();
let path = require('path');

app.listen(8080);
app.use("/", express.static(path.join(__dirname, "dist/movieAng")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/movies',{useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});


//Configuring Endpoints
//Actor RESTFul endpoionts
//7.
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
//2. Delete an actor and all its movies
app.delete('/actors/:id/delete', actors.removeActorAndMovies);
//3. Remove a movie from the list of movies of an actor
app.delete('/actors/:actorID/:movieID', actors.removeMovies);
app.delete('/deleteyoung', actors.deleteChild);

//Movie RESTFul  endpoints
//8.
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
//1. Delete a movie by its ID
app.delete('/movies/:id', movies.deleteOne);
//4. Remove an actor from the list of actors in a movie
app.delete('/movies/:movieID/:actorID', movies.removeActors);
//5. Add an existing actor to the list of actors in a movie
app.post('/movies/:id1/:id2', movies.addActor);
//6. Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.
app.get('/movies/:year1/:year2', movies.findByYear);

//7. Delete movie by after certain year
app.delete('/movies/year/:aYear', movies.deleteMovieYear);
