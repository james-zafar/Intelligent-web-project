const express = require('express');
const router = express.Router();

var mongodb = require('mongodb');

const users = require('../controllers/users');
const initDB = require('../controllers/init');
initDB.init();

var Story = require('../models/stories');


/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    /*** The below will eventually be called via the getStories class ***/
    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function (error, client) {
        if (error) {
            console.log("Database error: ", error);
            res.send(error);
        } else {
            var db = client.db('myStory');
            var collection = db.collection('stories');
            /** This query needs to be amended if/when we can retrieve the username **/
            var query = collection.find({});
            //Use the below to check if a user is logged in
            //if(this.user === undefined) {
            //If username arg is provided, look up that users stories
            //query = collection.find({'user_id': this.user});
            //}
            collection.find({}).toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    res.render('index', {
                        title: 'View your timeline',
                        //Currently uses generic profile pic
                        profileSource: 'https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
                        allStories: results
                    });
                }
            });
        }
    });
});

router.get('/createPost', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('createPost', {title: 'Create New Post'});

});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next) {
    users.authenticate(req, res, function (error, user) {
        if (error || !user) {
            const message = 'Wrong email or password.';
            console.log(message);
            const err = new Error(message);
            return next(err);
        }
        console.log("Login successful");
        req.session.loggedIn = true;
        console.log(user);
        req.session.username = user.email;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({redirect: '/timeline'}));
        // res.redirect() didnt work for me no idea why
    });
});

router.get('/logout', function(req, res, next) {
    req.session.loggedIn = false;
    req.session.userName = false;
    return res.redirect('/login');
});

router.post('/createStory', function (req, res) {
    //Get all possible content of the story
    var storyText = req.body.storyContent;
    var image0 = req.body.image0;
    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var images;
    //Check if images actually exist
    if(image0 === undefined) {
        images = [];
    }else if(image1 === undefined) {
        images = [image0];
    }else if(image2 === undefined) {
        images = [image0, image1];
    }
    var theStory = new Story({
        text: storyText,
        images: images,
        user_id: req.session.username
    });
    theStory.save(function (error, response) {
        if (error) {
            console.log("Error ", error);
            res.status(500).send('Internal Server Error: ', + error);
        } else {
            res.redirect('createPost');
        }
    });
});

router.get('/timeline', function(req, res) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    console.log(req.session.loggedIn);
    console.log(req.session.username);

    //console.log("Username? ?" + req.session.userId);
    /*** The below will eventually be called via the getStories class ***/
    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function (error, client) {
        if (error) {
            console.log("Database error: ", error);
            res.send(error);
        } else {
            var db = client.db('myStory');
            var collection = db.collection('stories');

            /** This query needs to be amended if/when we can retrieve the username **/
            var query = collection.find({});
            //Use the below to check if a user is logged in
            //if(this.user === undefined) {
                //If username arg is provided, look up that users stories
                //query = collection.find({'user_id': this.user});
            //}
            collection.find({}).toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    res.render('timeline', {
                        title: 'View your timeline',
                        profileSource: 'https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
                        allStories: results
                    });
                }
            });
        }
    });

});

module.exports = router;
