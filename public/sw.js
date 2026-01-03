importScripts('/scram/scramjet.all.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  try {
    // 1. Attempt to load config. 
    // If the DB is corrupted, this will fail, but we now catch the error.
    await scramjet.loadConfig();
  } catch (err) {
    // 2. Log the error but DO NOT crash.
    console.error("Service Worker Config Error (DB likely corrupted):", err);
    
    // 3. Fallback: If config fails, just fetch normally so the site doesn't break.
    return fetch(event.request);
  }

  // 4. If config loaded, proceed with proxying
  if (scramjet.route(event)) {
    return scramjet.fetch(event);
  }
  
  return fetch(event.request);
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // let TMDB images go straight to the network (no proxy)
  if (url.hostname === 'image.tmdb.org') {
    return; 
  }

  event.respondWith(handleRequest(event));
});
