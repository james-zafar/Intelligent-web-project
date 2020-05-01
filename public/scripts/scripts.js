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