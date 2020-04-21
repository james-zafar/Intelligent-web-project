function initPostsApp() {
  // loadData();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function() { console.log('Service Worker Registered'); });
  }
}

function loadData() {
  //Believe this should get stuff from database.js when we have stuff to store
  return null;
}