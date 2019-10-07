const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
module.exports = {
    getAll: function (req, res) {
        Actor.find().populate('movies').exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    //2. Delete an actor and all its movies
    removeActorAndMovies: function (req,res){
        Actor.findOne({_id: req.params.id}, function(err, actor){
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            actorList = actor.movies;
            for (i=0; i<actorList.length;i++){
                Movie.findOneAndRemove({ _id: actorList[i]}, function(err){
                    if (err) return res.status(400).json(err);
                    res.json();
                });
            }
            Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
                if (err) return res.status(400).json(err);
                res.json();
            });
        });
    },
    //3. Remove a movie from the list of movies of an actor
    removeMovies: function (req, res) {
        let actorId = req.params.actorID;
        let movieId= req.params.movieID;
        
        Actor.findOne({ _id: actorId }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            
            let newListMovies=deleteItem(actor.movies,movieId);
            actor.movies=newListMovies;
            
            actor.save(function(err){
                if (err) return res.status(500).json(err);
                res.json(actor);
            })
        });
    },
    deleteChild: function (req, res){
        Actor.deleteMany({bYear:{$gt:2004}}).exec(function(err){
            if (err) return res.status(400).json(err);
            res.json();
        })
        
        }
    
    
    
    
};

function deleteItem(items, id){
    for(i=0;i<items.length;i++){
        if (toString(items[i]) === toString(id)){
            console.log(items[i]);
            items.splice(i,1);
        };
    };
    return items;
};

 