const mongoose = require('mongoose');

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


} catch (e) {
    console.log('error in db connection: ' + e.message);
}
