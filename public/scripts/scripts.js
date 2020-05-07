function initPostsApp() {
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
    if ('indexedDB' in window) {
        initDatabase();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * Loads stories for a specific user
 * @param user
 * @param date
 */
function loadStorydata(user, date) {
    const input = JSON.stringify({user: user, date: date});
    $.ajax({
        url: '/stories',
        data: input,
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

function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        // success: function (dataR) {
        //     // no need to JSON parse the result, as we are using
        //     // dataType:json, so JQuery knows it and unpacks the
        //     // object for us before returning it
        //     // const ret = dataR;
        //     // in order to have the object printed by alert
        //     // we need to JSON stringify the object
        //     document.getElementById('results').innerHTML= JSON.stringify(dataR);
        // },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function send(url) {
    const formArray = $("form").serializeArray();
    let data = {};
    for (let index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    // data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery(url, data);
    event.preventDefault();
}

function loadData() {
    //Believe this should get stuff from database.js when we have stuff to store
    return null;
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


function showOfflineWarning() {
    if (document.getElementById('offline_div') != null) {
        document.getElementById('offline_div').style.display='block';
    }
}

function hideOfflineWarning() {
    if (document.getElementById('offline_div') != null) {
        document.getElementById('offline_div').style.display='none';
    }
}


// /**
//  * it shows the city list in the browser
//  */
// function showCityList() {
//     if (document.getElementById('city_list')!=null)
//         document.getElementById('city_list').style.display = 'block';
// }