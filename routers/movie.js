var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find().populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    //1.Delete a movie by its ID
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    //4. Remove an actor from the list of actors in a movie
    removeActors: function (req, res) {
        let movieId= req.params.movieID;
        let actorId = toString(req.params.actorID);
        
        Movie.findOne({ _id: movieId }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            
            let newListActors=deleteItem(movie.actors,actorId);
            movie.actors=newListActors;
            
            movie.save(function(err){
                if (err) return res.status(500).json(err);
                res.json(movie);
            })
        });
    },
    //5. Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.
    findByYear: function(req,res){
        let year1=parseInt(req.params.year1);
        let year2=parseInt(req.params.year2);
        
        Movie.where('year').lte(year1).gte(year2).exec(function(err,movie){
            if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
        })
    },
    //6. Add an existing actor to the list of actors in a movie
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id1}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.params.id2}, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },
    deleteMovieYear: function(req,res){
    let aYear = req.params.aYear;
    let query= {year:{$lt:aYear}}
    Movie.deleteMany(query,function (err) {
        if (err) return res.status(400).json(err);
        res.json();
    })
    },
};
function deleteItem(items, id){
    for(i=0;i<items.length;i++){
        if (toString(items[i]) === id){
            items.splice(i,1);
        };
    };
    return items;
};