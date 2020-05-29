const RankingAlgorithm = require('./Ranking');
// const Users = require('../controllers/users');
// const Stories = require('../controllers/Stories');
const Story = require('../models/stories');
const Users = require('../models/users');

/**
 *
 * @param user The ID associated with the user currently logged in
 * @returns An array of stories and ratings associated with the user
 */
async function getUserPreferences(user) {
    return new Promise(resolve => {
        Users.find({_id: user}, function (error, result) {
            if(error) {
                throw error;
            }
            resolve(result[0].voted_stories);
        });
    });
}

/**
 *
 * @returns {Promise<[]>} A list of all votes on all stories in the db
 */
async function getAllPostPreferences() {
    return new Promise(resolve => {
        Users.find({}, {voted_stories: 1}, function (error, result) {
            if(error) {
                throw error;
            }
            resolve(result);
        });
    });
}

/**
 *
 * @param posts A list of posts returned by the recommendation algorithm
 */
function sortPosts(posts) {

}

exports.getSortedStories = async function(currentUser) {
    const rankingAlgo = new RankingAlgorithm();

    let preferences = await getUserPreferences(currentUser);
    let postPreferences = await getAllPostPreferences();
    //console.log("Here: " + postPreferences);

    //Add a third parameter of "similarity = 'sim_euclidean' to run with euclidean algorithm
    let actualScores = await rankingAlgo.getRecommendations(postPreferences, preferences);
    //console.log(actualScores);

    return await sortPosts(actualScores);
};