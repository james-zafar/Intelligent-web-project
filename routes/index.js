const express = require('express');
const router = express.Router();

var mongodb = require('mongodb');

const users = require('../controllers/users');
const stories = require('../controllers/stories');
const initDB = require('../controllers/init');
initDB.init();

var Story = require('../models/stories');

var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('index');
    stories.getAll(req, res, function (error, stories) {
        if (error || !stories) {
                const message = 'No stories in db.';
                console.log(message);
                const err = new Error(message);
                return next(err);
        }
        res.io.on('connection', function() {
            res.io.sockets.emit('broadcast', stories);
        });
    });
});

router.get('/createPost', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('createPost', { title: 'Create New Post', req: req});
});

router.get('/login', function (req, res, next) {
    if (req.session.loggedIn) {
        return res.redirect('/');
    }
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
        console.log(user);
        req.session.loggedIn = true;
        req.session.user = user;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({redirect: '/'}));
        // res.redirect() didnt work for me no idea why
    });
});

router.get('/logout', function(req, res, next) {
    req.session.loggedIn = false;
    req.session.user = undefined;
    return res.redirect('/login');
});

router.post('/uploadUser', function (req, res, next) {
    users.insertFromJson(req, res, function (error, results) {
        if (error || !results) {
            console.log(error)
            const err = new Error(error);
            return next(err);
        }
        res.sendStatus(200);
    });
});

router.post('/uploadStory', function (req, res, next) {
    stories.insertFromJson(req, res, function (error, results) {
        console.log("story added");
        if (error || !results) {
            console.log(error)
            const err = new Error(error);
            return next(err);
        }
        res.sendStatus(200);
    });
});

router.post('/getStories', function(req, res) {
    const url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function (error, client) {
        if (error) {
            console.log("Database error: ", error);
            res.send(error);
        } else {
            const db = client.db('myStory');
            const collection = db.collection('stories');
            collection.find({}).toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(results));
                }
            });
        }
    });
});

router.post('/createStory', function (req, res) {
    //Get all possible content of the story
    var storyText = req.body.storyContent;
    var image0 = req.body.image0;
    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var images;
    console.log("Image? " + image0 + " 1 " + image1 + " 2 " + image2);
    //Check if images actually exist
    if(image0 === undefined) {
        images = [];
    }else if(image1 === undefined) {
        images = [image0];
    }else if(image2 === undefined) {
        images = [image0, image1];
    }
    console.log("Adding images: " + images.length);
    var theStory = new Story({
        text: storyText,
        images: images,
        user_id: req.session.user._id
    });
    theStory.save(function (error, response) {
        if (error) {
            console.log("Error ", error);
            //res.status(500).send('Internal Server Error: ', + error);
        } else {
            res.redirect('createPost/?disp=true');
        }
    });
});

router.get('/timeline', function(req, res) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    var currentUser = req.session.user.first_name + " " + req.session.user.family_name;

    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function (error, client) {
        if (error) {
            console.log("Database error: ", error);
            res.send(error);
        } else {
            var db = client.db('myStory');
            var collection = db.collection('stories');

            var userObject = req.session.user._id;
            var findStories = collection.find({user_id: userObject});

            findStories.toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    res.render('timeline', {
                        title: 'View your timeline',
                        profileSource: 'https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
                        allStories: results,
                        author: currentUser,
                        req: req
                    });
                }
            });
        }
    });
});

router.post('/editPost', function(req, res) {
    var storyID = req.body.storyID;
    var mongoID = new mongodb.ObjectID(storyID);

    var newText = req.body.storyText;

    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function(err, client) {
        if (err) throw err;

        var db = client.db('myStory');
        var collection = db.collection('stories');
        var selectStory = { _id: mongoID };
        var update = { $set: {text: newText } };

        //collection.count({_id: mongoID}, function (err, count) {
        //    console.log("Stoies with ID: " + count);
        //});
        collection.updateOne(selectStory, update, function(error, result) {
            if (error) {
                console.log("Error updating story...", error);
                res.redirect('/timeline?edit=False&error=fatal&postID=' + storyID);
                throw error;
            }else {
                res.redirect('/timeline?edit=True&postID=' + storyID);
            }
        });
        client.close();
    });
});

router.post('/sharePost', function (req, res) {
    var storyID = req.body.storyID;
    var shareURL = 'share?direct=true%26viewPostID=' + storyID;
    res.redirect('/timeline?share=True&sharePostID=' + storyID + '&url=' + shareURL);
    //TODO: Implement the share button feature
});

router.post('/deletePost', function (req, res) {
    var postToDelete = req.body.storyID;
    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function(err, client) {
        if (err) throw err;

        var db = client.db('myStory');
        var collection = db.collection('stories');

        var mongoID = new mongodb.ObjectID(postToDelete);
        var queryPost = { _id: mongoID };
        collection.deleteOne(queryPost, function(error, result) {
            if (error) {
                console.log("Error removing story...", error);
                throw error;
            }else {
                res.redirect('/timeline?deleteID=' + postToDelete + '&removed=true');
            }
            client.close();
        });
    });
});

router.get('/share', function (req, res) {
    var url = 'mongodb://localhost:27017/';
    console.log("Shared story: " + req.query.viewPostID);
    var mongoID = new mongodb.ObjectID(req.query.viewPostID);
    mongodb.connect(url, function (error, client) {
        if (error) {
            console.log("Database error: ", error);
            res.send(error);
        } else {

            var db = client.db('myStory');
            var collection = db.collection('stories');

            collection.find({_id : mongoID}).toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    var userDB = db.collection('users');
                    var newQuery = userDB.find({_id: results[0].user_id});
                    newQuery.toArray(function(err, result) {
                        var author = result[0].first_name + " " + result[0].family_name;
                        res.render('share', {
                            title: 'View Shared Post',
                            profileSource: 'https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
                            theStory: results[0],
                            author: author,
                            req: req
                        });
                    });
                }
            });
        }
    });
});

module.exports = router;
