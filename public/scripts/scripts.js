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