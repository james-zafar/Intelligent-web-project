const RankingAlgorithm = require('./Ranking');
// const Users = require('../controllers/users');
// const Stories = require('../controllers/Stories');
const Story = require('../models/stories');
const Users = require('../models/users');

async function getUserPreferences(user) {
    const query = Users.find({_id: user});

    return query.voted_stories;
}

async function getAllPostPreferences() {
    const query = Users.find({});
    console.log("The user ID... ", query);
    let allPostPrefs = [];
    query.toArray(function (error, results) {
        if(error) {
            //Do something
        }
        for(let current in results) {
            allPostPrefs[current._id] = current.voted_stories;
        }
    });
    return allPostPrefs;
}

function sortPosts(posts) {

}

exports.getSortedStories = async function(currentUser) {
    const rankingAlgo = new RankingAlgorithm();

    let preferences = await getUserPreferences(currentUser);

    let postPreferences = await getAllPostPreferences();

    let actualScores = await rankingAlgo.getRecommendations(postPreferences, preferences);

    return await sortPosts(actualScores);
};