let dbPromise;

const DB_NAME = 'db_my_story_1';
const STORIES_STORE_NAME = 'store_stories';

/**
 * Initialises the database
 */
function initDatabase() {
    dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORIES_STORE_NAME)) {
            let storiesDB = upgradeDb.createObjectStore(STORIES_STORE_NAME, {keyPath: 'id'});
            storiesDB.createIndex('text', 'text', {unique: false, multiEntry: true});
            storiesDB.createIndex('image', 'image', {unique: false, multiEntry: true});
            storiesDB.createIndex('date', 'date', {unique: false, multiEntry: true});
            storiesDB.createIndex('user_id', 'user_id', {unique: false, multiEntry: true});
            storiesDB.createIndex('votes', 'votes', {unique: false, multiEntry: true});
        }
    });
}

/**
 * Saves stories for a user in indexedDB
 * @param storyObject
 */
function storeCachedData(storyObject) {
    console.log('inserting: '+ JSON.stringify(storyObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            let tx = db.transaction(STORIES_STORE_NAME, 'readwrite');
            let store = tx.objectStore(STORIES_STORE_NAME);
            // await store.put(storyObject);
            await store.add(storyObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(storyObject));
        }).catch(function () {
            localStorage.setItem(storyObject._id, JSON.stringify(storyObject));
        });
    } else  {
        localStorage.setItem(storyObject._id, JSON.stringify(storyObject));
    }
}

/**
 * Gets all stories from indexedDB
 * @returns {*}
 */
function getCachedData() {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching stories');
            const tx = db.transaction(STORIES_STORE_NAME, 'readonly');
            const store = tx.objectStore(STORIES_STORE_NAME);
            return store.getAll();
            // let index = store.index('location');
            // return index.getAll(IDBKeyRange.only(user));
        }).then(function () {
            console.log('got stories from indexeddb');
        }).catch(function () {
            for (let story of localStorage) {
                if (story == null) {
                    addToResults(story);
                }
            }
        });
        // }).then(function (readingsList) {
        //     if (readingsList && readingsList.length > 0){
        //         let max;
        //         for (let elem of readingsList) {
        //             if (!max || elem.date > max.date) {
        //                 max = elem;
        //             }
        //         }
        //         if (max) {
        //             addToResults(max);
        //         }
        //     } else {
        //         const value = localStorage.getItem(storyID);
        //         if (value == null) {
        //             addToResults({city: city, date: date});
        //         }
        //         else {
        //             addToResults(value);
        //         }
        //     }
        // });
    } else {
        for (let story of localStorage) {
            if (story == null) {
                addToResults(story);
            }
        }
    }
}


