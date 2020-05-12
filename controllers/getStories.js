/**
 * This will be used to simplify ../routes/index.js in the future
 * DO NOT USE yet as it is not fully implemented
 * **/
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/';


/**
 * Class to handle requests to get stories from DB
 */
class GetStories {

    /**
     * By default, no user means retrieve all stories
     */
    constructor() {
        this.user = undefined;
    }

    /**
     *
     * @param userID the username of the user stories to be retrieved
     */
    set theUser(userID) {
        this.user = userID;
    }

    get getAllStories() {
        console.log("My user is: " + this.user);
        mongoClient.connect(url, function (error, client) {
            console.log("My user is: " + this.user);
            if (error) {
                console.log("Database error: ", error);
                res.send(error);
            } else {
                var db = client.db('myStory');
                var collection = db.collection('stories');
                var query = collection.find({});
                if(this.user === undefined) {
                    //If username arg is provided, look up that users stories
                    //query = collection.find({'user_id': this.user});
                }
                query.exec.toArray(function (error, results) {
                    if (error) {
                        console.log("Error retrieving data: ", error);
                        res.send(error);
                    } else {
                        return JSON.stringify(results);
                    }
                });
            }
        });
    }
}

module.exports = GetStories;