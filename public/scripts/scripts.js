function initMyStory() {
    // loadData();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function(registration) {
            //success
            console.log('Service Worker Registered with scope: ' + registration.scope);
            }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
            });
    }
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}


/**
 * Given the list of stories, it will retrieve all the data from
 * the server (or failing that) from the database
 */
function loadData() {
    const stories = JSON.parse(localStorage.getItem('stories'));
    // cityList = removeDuplicates(cityList);
    retrieveStories(stories, new Date().getTime());
}

/**
 * Cycles through the list of stories and requests the data from the server for each
 * story
 * @param stories - the list of the stories the user has requested
 * @param date - the date of the stories (not in use)
 */
function retrieveStories(stories, date){
    // refreshCityList();
    for (let story of stories) {
        loadStorydata(story, date);
    }
}

/**
 * it removes all stories from the result div
 */
function refreshCityList() {
    if (document.getElementById('results')!=null) {
        document.getElementById('results').innerHTML='';
    }
}

/**
 * Loads all stories
 // * @param date
 */
function loadStories(user, date) {
    // const input = JSON.stringify({user: user, date: date});
    $.ajax({
        url: '/stories',
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            // addToResults(dataR);
            storeCachedData(dataR.user, dataR);
            // if (document.getElementById('offline_div')!=null)
            //     document.getElementById('offline_div').style.display='none';
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            // showOfflineWarning();
            getCachedData(user, date);
            // const dvv = document.getElementById('offline_div');
            // if (dvv != null) {
            //     dvv.style.display='block';
            // }
        }
    });
    // // hide the list of cities if currently shown
    // if (document.getElementById('city_list') != null)
    //     document.getElementById('city_list').style.display = 'none';
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    loadData();
}, false);


function showOfflineWarning(){
  if (document.getElementById('offline_div')!=null)
    document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
  if (document.getElementById('offline_div')!=null)
    document.getElementById('offline_div').style.display='none';
}


/**
 * it shows the city list in the browser
 */
function showCityList() {
  if (document.getElementById('city_list')!=null)
    document.getElementById('city_list').style.display = 'block';
}

/**
 * Send ajax query then if response contains redirect,
 * redirect to that page
 * @param url
 * @param data
 */
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            if (dataR !== undefined) {
                window.location.href = dataR.redirect;
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * Send a post request from a form to a specific url
 * @param url
 */
function send(url) {
    const formArray = $("form").serializeArray();
    let data = {};
    for (let index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    data = JSON.stringify(data);
    console.log(data);
    sendAjaxQuery(url, data);
    event.preventDefault();
}
