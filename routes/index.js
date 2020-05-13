const express = require('express');
const router = express.Router();

const users = require('../controllers/users');
const stories = require('../controllers/stories');
const initDB = require('../controllers/init');
initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('index', { title: 'Express' });
});

router.get('/createPost', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    res.render('createPost', { title: 'Create New Post'});
});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next) {
    users.authenticate(req, res, function (error, user) {
        if (error || !user) {
            const message = 'Wrong email or password.'
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

router.get('/timeline', function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    console.log(req.session.loggedIn)
    res.render('timeline', {
        title: 'View your timeline',
        profileSource: 'https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        userName: req.session.username,
        timePosted: '10 Minutes Ago'
    });
});

module.exports = router;
