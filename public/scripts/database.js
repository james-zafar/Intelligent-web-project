let dbPromise;

const DB_NAME = 'db_my_story_1';
const STORIES_STORE_NAME = 'store_stories';

/**
 * Initialises the database
 */
function initDatabase() {
    dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORIES_STORE_NAME)) {
            let storyDB = upgradeDb.createObjectStore(STORIES_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storyDB.createIndex('text', 'text', {unique: false, multiEntry: true});
            storyDB.createIndex('image', 'image', {unique: false, multiEntry: true});
            storyDB.createIndex('date', 'date', {unique: false, multiEntry: true});
            storyDB.createIndex('user_id', 'user_id', {unique: false, multiEntry: true});
        }
    });
}

/**
 * Saves stories for a user in indexedDB
 * @param user
 * @param storyObject
 */
function storeStory(storyObject) {
    console.log('inserting: '+ JSON.stringify(storyObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            let tx = db.transaction(STORIES_STORE_NAME, 'readwrite');
            let store = tx.objectStore(STORIES_STORE_NAME);
            await store.put(storyObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ storyObject);
        }).catch(function (e) {
            localStorage.setItem(storyObject.user_id, storyObject);
        });
    } else  {
        localStorage.setItem(storyObject.user_id, storyObject);
    }
}

/**
 * Gets story data for a user from the database
 * @param user
 * @param date
 * @returns {*}
 */
function getStoriesUser(user, date) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching stories for: '+ user);
            let tx = db.transaction(STORIES_STORE_NAME, 'readonly');
            let store = tx.objectStore(STORIES_STORE_NAME);
            let index = store.index('user');
            return index.getAll(IDBKeyRange.only(user));
        }).then(function (readingsList) {
            if (readingsList && readingsList.length > 0) {
                let max;
                for (let elem of readingsList) {
                    if (!max || elem.date > max.date) {
                        max = elem;
                    }
                }
                if (max) {
                    console.log("ASJFAISFIASFAISFPIF");
                    return(max)
                    // addToResults(max);
                }
            }
        })
    //         } else {
    //             const value = localStorage.getItem(user);
    //             if (value == null) {
    //                 addToResults({city: user, date: date});
    //             }
    //             else {
    //                 addToResults(value);
    //             }
    //         }
    //     });
    // } else {
    //     const value = localStorage.getItem(user);
    //     if (value == null) {
    //         addToResults( {user: user, date: date});
    //     }
    //     else {
    //         addToResults(value);
    //     }
    }
}

function getStoriesAll(date) {
    dbPromise.then(function (db) {
        console.log('fetching all stories');
        let tx = db.transaction(STORIES_STORE_NAME, 'readonly');
        let store = tx.objectStore(STORIES_STORE_NAME);;
        return store.getAll();
    }).then(function (readingsList) {
        if (readingsList && readingsList.length > 0) {
            let max;
            for (let elem of readingsList) {
                if (!max || elem.date > max.date) {
                    max = elem;
                }
            }
            if (max) {
                console.log("ASJFAISFIASFAISFPIF");
                // addToResults(max);
            }
        }
    })
}


