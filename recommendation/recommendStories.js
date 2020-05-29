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
            //Process results to get in the correct form for recommendation algorithm
            let allStories = [];
            for(let i = 0; i < result.length; i++ ) {
                let temp = [];
                for (let j = 0; j < result[i].voted_stories.length; j++) {
                    //Attach story and rating
                    temp.push(
                        {
                            storyID: result[i].voted_stories[j].storyId,
                            rating: result[i].voted_stories[j].rating
                        }
                    );
                }
                var theUser = result[i]._id;
                var finalStructure = {};

                //Attach all ratings to the user associated with them
                finalStructure[theUser] = temp;

                //Add to the list of all user ratings
                allStories.push(finalStructure);
            }
            resolve(allStories);
        });

    });
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
    console.log(actualScores);
    return await sortPosts(actualScores);
};