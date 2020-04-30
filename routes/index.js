const express = require('express');
const router = express.Router();

const users = require('../controllers/users');
const stories = require('../controllers/stories');
const initDB = require('../controllers/init');
initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/createPost', function(req, res, next) {
    res.render('createPost', { title: 'Create New Post'});
});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next) {
    users.getByEmail(req, res);
    // users.getByEmail(function(req2, res2) {
    //     if (JSON.parse(res2.user).validPassword(req.body.password)) {
    //         res.redirect('/')
    //     } else {
    //         res.render('login', { message: 'Incorrect password.'})
    //     }
    // });
});

module.exports = router;
