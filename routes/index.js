var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createPost', function(req, res, next) {
  res.render('createPost', { title: 'Create New Post'});
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
