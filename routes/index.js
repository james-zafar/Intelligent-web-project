const express = require('express');
const router = express.Router();

const users = require('../controllers/users');
const initDB = require('../controllers/init');
initDB.init();

var Story = require('../models/stories');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/createPost', function(req, res, next) {
    res.render('createPost', {title: 'Create New Post', displayParam: 'display:none;'})
});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next) {
    users.authenticate(req, res, function (error, user) {
        if (error || !user) {
            const err = new Error('Wrong email or password.');
            return next(err);
        } else {
            // req.session.userId = user._id;
            // res.render('index')
            res.redirect('/');
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
    //Check if images actually exist
    if(image0 === undefined) {
        images = [];
    }else if(image1 === undefined) {
        images = [image0];
    }else if(image2 === undefined) {
        images = [image0, image1];
    }
    if(bodyText === null) {
        res.status(403).send('No data submitted')
    }else {
        var theStory = new Story({
            text: storyText,
            images: images
        });
        theStory.save(function (error, response) {
            if (error) {
                console.log("Error ", error);
                response.status(500).send('Internal Server Error')
            } else {
                res.render('createPost', {title: 'Create New Post', displayParam: ''})
            }
        });
    }
});


router.get('/timeline', function(req, res, next) {
  res.render('timeline', {
    title: 'View your timeline',
    profileSource: 'https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    userName: 'James Zafar',
    timePosted: '10 Minutes Ago'
  });
});

module.exports = router;
