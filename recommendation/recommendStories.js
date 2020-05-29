const RankingAlgorithm = require('./Ranking');

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
            let stories = result[0].voted_stories
            let temp = []
            for (let i = 0; i < stories.length; i++) {
                temp.push(
                  {
                      storyID: stories[i].storyId,
                      rating: stories[i].rating
                  }
                )
            }
            console.log(temp)
            let temp2 = {
                user_id: result[0].user_id,
                voted_stories: temp
            }
        })

    });
// stories[i]._id = undefined

}

/**
 *
 * @param posts A list of posts returned by the recommendation algorithm
 */
async function sortPosts(posts) {
    return new Promise(resolve => {
        resolve(posts);
    });
}

exports.getSortedStories = async function(currentUser) {
    const rankingAlgo = new RankingAlgorithm();
    //Get the user preferences and all other prefs
    let preferences = await getUserPreferences(currentUser);
    let postPreferences = await getAllPostPreferences();

    //Add a third parameter of "similarity = 'sim_euclidean' to run with euclidean algorithm
    let actualScores = await rankingAlgo.getRecommendations(postPreferences, preferences);

    return await sortPosts(actualScores);
};