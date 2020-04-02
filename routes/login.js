const express = require('express');
const router = express.Router();

const user = require('../controllers/users');
const initDB = require('../controllers/init');
initDB.init();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Log in' });
});

router.post('/', function(req, res, next) {
  res.render('login', user.insert);
});

module.exports = router;
