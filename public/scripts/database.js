let dbPromise;

const DB_NAME = 'db_my_story_1';
const STORIES_STORE_NAME = 'store_stories';

/**
 * Initialises the database
 */
function initDatabase() {
    dbPromise = idb.openDb(DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORIES_STORE_NAME)) {
            let forecastDB = upgradeDb.createObjectStore(STORIES_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            forecastDB.createIndex('text', 'text', {unique: false, multiEntry: true});
            forecastDB.createIndex('image', 'image', {unique: false, multiEntry: true});
            forecastDB.createIndex('date', 'date', {unique: false, multiEntry: true});
            forecastDB.createIndex('user_id', 'user_id', {unique: false, multiEntry: true});
        }
    });
}

/**
 * Saves stories for a user in indexedDB
 * @param user
 * @param storyObject
 */
function storeCachedData(user, storyObject) {
    console.log('inserting: '+ JSON.stringify(storyObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            let tx = db.transaction(STORIES_STORE_NAME, 'readwrite');
            let store = tx.objectStore(STORIES_STORE_NAME);
            await store.put(storyObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(storyObject));
        }).catch(function (e) {
            localStorage.setItem(user, JSON.stringify(storyObject));
        });
    } else  {
        localStorage.setItem(user, JSON.stringify(storyObject));
    }
}

/**
 * Gets story data for a user from the database
 * @param user
 * @param date
 * @returns {*}
 */
function getCachedData(user, date) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: '+ user);
            let tx = db.transaction(STORIES_STORE_NAME, 'readonly');
            let store = tx.objectStore(STORIES_STORE_NAME);
            let index = store.index('location');
            return index.getAll(IDBKeyRange.only(user));
        }).then(function (readingsList) {
            if (readingsList && readingsList.length > 0){
                let max;
                for (let elem of readingsList) {
                    if (!max || elem.date > max.date) {
                        max = elem;
                    }
                }
                if (max) {
                    addToResults(max);
                }
            } else {
                const value = localStorage.getItem(user);
                if (value == null) {
                    addToResults({city: city, date: date});
                }
                else {
                    addToResults(value);
                }
            }
        });
    } else {
        const value = localStorage.getItem(user);
        if (value == null) {
            addToResults( {user: user, date: date});
        }
        else {
            addToResults(value);
        }
    }
}


