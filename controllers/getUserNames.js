const Users = require('../models/users');


async function getUserName(id) {
    return new Promise(resolve => {
        Users.find({_id: id}, function (error, result) {
            if(error) {
                throw error;
            }
            const name = result[0].first_name + " " + result[0].family_name;
            resolve(name);
        });
    });
}

/**
 *
 * @param stories A list of stories with user IDs
 * @returns  A list of stories with userID replaced with names
 */
exports.replaceUserIDs = async function replaceUserIDs(stories) {
    return new Promise(resolve => {
        for (let i = 0; i < stories.length; i++) {
            (async (stories) => {
                const temp = () => {
                    return getUserName(stories[i].user_id);
                };
                stories[i].user_id = await temp();
                console.log("Finishing... " + stories[i].user_id);
                if(i === (stories.length - 1)) {
                    console.log(stories[0].user_id);
                    console.log("Finished");
                    resolve(stories);
                }
            })(stories);
        }

    });
};