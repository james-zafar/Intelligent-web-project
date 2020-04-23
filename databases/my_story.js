const mongoose = require('mongoose');
// const ObjectId = require('mongodb').ObjectID;
// const bcrypt = require('bcryptjs');

// The URL which will be queried. Run "mongod.exe" for this to connect

mongoose.Promise = global.Promise;
const mongoDB = 'mongodb://localhost:27017/myStory';

mongoose.Promise = global.Promise;
try {
    connection = mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        checkServerIdentity: false,
    });
    console.log('connection to myStory mongodb worked!');

// db.dropDatabase();

} catch (e) {
    console.log('error in db connection: ' + e.message);
}
