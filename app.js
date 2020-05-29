const bodyParser = require('body-parser');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const https = require('https');

const MongoStore = require('connect-mongo')(session)

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();


/**
 * Set HTTPs server options
 */
try {
    options = {
        key: fs.readFileSync('../private_access/key.pem'),
        cert: fs.readFileSync('../private_access/server.crt')
    }
} catch(error) {
    options = {
        key: fs.readFileSync('./private_access/key.pem'),
        cert: fs.readFileSync('./private_access/server.crt')
    }
}

/**
 * Create HTTPs server
 */
const server = https.createServer(options, app);

/**
 * Initialise socket.io
 */
const io = require('socket.io')(server);
const socketModule = require('./socket/socket.io');
app.use(function (req, res, next) {
    res.io = io;
    next();
});
socketModule.init(io, app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// sessions setup
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: 'mongodb://localhost:27017/myStory' }),
  loggedIn: false
}));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};