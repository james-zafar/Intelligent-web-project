/**
 * Initiates the web application
 */
function initMyStory() {
    loadData();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('../service-worker.js')
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
        console.log("index db installed");
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
    // const stories = JSON.parse(localStorage.getItem('stories'));
    // cityList = removeDuplicates(cityList);
    refreshStories();
    // loadStories();
    loadStoriesSocketIO()
}

/**
 * Removes all stories from the results div
 */
function refreshStories() {
    if (document.getElementById('results') != null) {
        document.getElementById('results').innerHTML='';
    }
}

/**
 * Given the story data returned by the server,
 * it adds a story to the results div
 * @param dataR the data returned by the server:
 */
function addToResults(dataR) {
    let resultsDiv = document.getElementById('results');
    if (resultsDiv != null) {
        const storyDiv = document.createElement('div');
        resultsDiv.appendChild(storyDiv);
        storyDiv.setAttribute('id', dataR._id);
        storyDiv.classList.add('card');
        storyDiv.classList.add('body-card');

        let storyHeader = document.createElement('div');
        storyDiv.appendChild(storyHeader);
        storyHeader.classList.add('card-header');

        let storyUsername = document.createElement('div');
        storyHeader.appendChild(storyUsername);
        storyUsername.setAttribute('id', 'userName');
        storyUsername.innerHTML = dataR.user_id;

        let storyDate = document.createElement('div');
        storyHeader.appendChild(storyDate);
        storyDate.setAttribute('id', 'timePosted');
        storyDate.innerHTML = new Date(dataR.date).toString();

        let storyContent = document.createElement('div');
        storyDiv.appendChild(storyContent);
        storyContent.classList.add('card-body');

        let storyText = document.createElement('p');
        storyContent.appendChild(storyText);
        storyText.classList.add('storyText');
        storyText.innerHTML = dataR.text;

        if (dataR.image != null) {
            let storyImage = document.createElement('img');
            storyContent.appendChild(storyText);
            storyImage.classList.add('storyImage');
            storyImage.src = 'data:image/png;base64' + dataR.image.toString('base64');
        }

        let storyLikes = document.createElement('div');
        storyDiv.appendChild(storyLikes);
        storyLikes.classList.add('card-footer');
        if (dataR.votes != null) {
            storyLikes.innerHTML = dataR.votes;
        } else {
            storyLikes.innerHTML = "No ratings";
        }

        resultsDiv.appendChild(document.createElement('br'));
    }
}

/**
 * Loads all stories with Ajax. If there's a connection error use indexeddb data.
 */
function loadStories() {
    // const input = JSON.stringify({user: user, date: date});
    $.ajax({
        url: '/getStories',
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            for (let story of dataR) {
                addToResults(story);
                storeCachedData(story);
            }
            console.log("ONLINE!!!!");
            hideOfflineWarning();
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            getCachedData();
            console.log("OFFLINE!!!!");
            showOfflineWarning();
        }
    });
    // // hide the list of cities if currently shown
    // if (document.getElementById('city_list') != null)
    //     document.getElementById('city_list').style.display = 'none';
}

/**
 * Loads stories with socket.io. If there's a connection error use indexeddb data.
 */
function loadStoriesSocketIO() {
    const myStorySocket = io.connect('https://localhost:3000');
    let reconnectErrors = 0;
    myStorySocket.on('broadcast', function(data) {
        Function.name = 'display';
        $('#results').empty();
        for (let story of data) {
            addToResults(story);
            storeCachedData(story);
        }
        console.log("ONLINE!!!!");
        hideOfflineWarning();
        reconnectErrors = 0;
    });

    myStorySocket.on('disconnect', function () {
        console.log("OFFLINE!!!!");
        showOfflineWarning();
    });

    myStorySocket.on('reconnect_error', function () {
        if (reconnectErrors < 1) {
            $('#results').empty();
            console.log("OFFLINE!!!!");
            getCachedData();
            showOfflineWarning();
        }
        reconnectErrors++;
    });
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    console.log("You are online");
    hideOfflineWarning();
    loadData();
}, false);

/**
 * Shows any hidden offline warnings and hides any non-hidden online warnings
 */
function showOfflineWarning(){
    const offlineWarning = document.getElementById('offline-warning');
    if (offlineWarning != null) {
        offlineWarning.style.display = 'inline-block';
    }
    const onlineWarning = document.getElementById('online-warning');
    if (onlineWarning != null) {
        onlineWarning.style.display = 'none';
    }
}

/**
 * Hides any non-hidden offline warnings and shows any hidden online warnings
 */
function hideOfflineWarning(){
    const offlineWarning = document.getElementById('offline-warning');
    if (offlineWarning != null) {
        offlineWarning.style.display = 'none';
    }
    const onlineWarning = document.getElementById('online-warning');
    if (onlineWarning != null) {
        onlineWarning.style.display = 'inline-block';
    }
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
            window.location.href = dataR.redirect;
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
    sendAjaxQuery(url, data);
    event.preventDefault();
}

/**
 * Function to handle user request to change the sort method of stories
 */
function clickEvent(clickedID) {
    const indexSocket = io.connect('https://localhost:3000');
    $(".dropdown-item").click(function () {
        $(".btn:first-child").text("Order by " + $(this).text());
    });
    indexSocket.emit('reformatStories', clickedID);
}