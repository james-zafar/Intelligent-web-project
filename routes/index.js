const express = require('express');
const router = express.Router();

var mongodb = require('mongodb');

const users = require('../controllers/users');
const initDB = require('../controllers/init');
initDB.init();

var Story = require('../models/stories');

var fs = require('fs');


/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function (error, client) {
        if (error) {
            console.log("Database error: ", error);
            res.send(error);
        } else {
            var db = client.db('myStory');
            var collection = db.collection('stories');
            collection.find({}).toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    (async function (results) {
                        function processResults(results) {
                            return new Promise(resolve => {
                                for (let current of results) {
                                    console.log("Starting loop...");
                                    var userID = new mongodb.ObjectID(current.user_id);
                                    var userDB = db.collection('users');
                                    var newQuery = userDB.find({_id: userID});
                                    newQuery.toArray(function (err, result) {
                                        current.user_id = result[0].first_name + " " + result[0].family_name;
                                        current['averageRating'] = 3;
                                        current.likeCount = 4;
                                        console.log("Exiting Loop " + current.user_id);
                                    });
                                }
                                console.log("Finished: " + results);
                                resolve(results);
                            });
                        }

                        const processedRes = await processResults(results);
                        res.render('index', {
                            title: 'Index',
                            allStories: processedRes,
                            req: req,

                        });
                    })(results);
                }
            });
        }
    });
});

router.get('/createPost', function (req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('createPost', {title: 'Create New Post', req: req});
});

router.get('/login', function (req, res, next) {
    if (req.session.loggedIn) {
        return res.redirect('/timeline');
    }
    res.render('login', {title: 'Login'});
});

router.post('/login', function (req, res, next) {
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
        req.session.user = user;
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({redirect: '/timeline'}));
        // res.redirect() didnt work for me no idea why
    });
});

router.get('/logout', function (req, res, next) {
    req.session.loggedIn = false;
    req.session.user = undefined;
    return res.redirect('/login');
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
    if (image0 === undefined) {
        images = [];
    } else if (image1 === undefined) {
        images = [image0];
    } else if (image2 === undefined) {
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

router.get('/timeline', function (req, res) {
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

            var userObject = new mongodb.ObjectID(req.session.user._id);
            var findStories = collection.find({user_id: userObject});

            findStories.toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    res.render('timeline', {
                        title: 'View your timeline',
                        allStories: results,
                        author: currentUser,
                        req: req
                    });
                }
            });
        }
    });
});

router.post('/editPost', function (req, res) {
    var storyID = req.body.storyID;
    var mongoID = new mongodb.ObjectID(storyID);

    var newText = req.body.storyText;

    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function (err, client) {
        if (err) throw err;

        var db = client.db('myStory');
        var collection = db.collection('stories');
        var selectStory = {_id: mongoID};
        var update = {$set: {text: newText}};

        //collection.count({_id: mongoID}, function (err, count) {
        //    console.log("Stoies with ID: " + count);
        //});
        collection.updateOne(selectStory, update, function (error, result) {
            if (error) {
                console.log("Error updating story...", error);
                res.redirect('/timeline?edit=False&error=fatal&postID=' + storyID);
                throw error;
            } else {
                res.redirect('/timeline?edit=True&postID=' + storyID);
            }
        });
        client.close();
    });
});

router.post('/deletePost', function (req, res) {
    var postToDelete = req.body.storyID;
    var url = 'mongodb://localhost:27017/';
    mongodb.connect(url, function (err, client) {
        if (err) throw err;

        var db = client.db('myStory');
        var collection = db.collection('stories');

        var mongoID = new mongodb.ObjectID(postToDelete);
        var queryPost = {_id: mongoID};
        collection.deleteOne(queryPost, function (error, result) {
            if (error) {
                console.log("Error removing story...", error);
                throw error;
            } else {
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

            collection.find({_id: mongoID}).toArray(function (error, results) {
                if (error) {
                    console.log("Error retrieving data: ", error);
                    res.send(error);
                } else {
                    var userDB = db.collection('users');
                    var newQuery = userDB.find({_id: results[0].user_id});
                    newQuery.toArray(function (err, result) {
                        var author = result[0].first_name + " " + result[0].family_name;
                        res.render('share', {
                            title: 'View Shared Post',
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

router.post('/addLikeRating', users.updateRating);

module.exports = router;
