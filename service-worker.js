// To clear cache on devices, always increase APP_VER number after making changes.
// The app will serve fresh content right away or after 2-3 refreshes (open / close)
var APP_NAME = 'Mangapul';
var APP_VER = '0.1.1';
var CACHE_NAME = APP_NAME + '-' + APP_VER;

// Files required to make this app work offline.
// Add all files you want to view offline below.
// Leave REQUIRED_FILES = [] to disable offline.
var REQUIRED_FILES = [
  '/mangapul/401.html',
  '/mangapul/404.html',
  '/mangapul/500.html',
  '/mangapul/assets/demo/chart-area-demo.js',
  '/mangapul/assets/demo/chart-bar-demo.js',
  '/mangapul/assets/demo/chart-pie-demo.js',
  '/mangapul/assets/icons/favicon.ico',
  '/mangapul/assets/icons/icon-192x192.png',
  '/mangapul/assets/icons/icon-512x512.png',
  '/mangapul/assets/images/index.html',
  '/mangapul/assets/images/_default_doctor.jpg',
  '/mangapul/assets/images/_default_person.jpg',
  '/mangapul/assets/images/_default_person.png',
  '/mangapul/assets/images/_default_slide.jpg',
  '/mangapul/assets/images/_logo.jpg',
  '/mangapul/assets/images/_logo_report.jpg',
  '/mangapul/assets/img/error-404-monochrome.svg',
  '/mangapul/css/styles.css',
  '/mangapul/demo.json',
  '/mangapul/index.html',
  '/mangapul/js/datatables-simple-demo.js',
  '/mangapul/js/scripts.js',
  '/mangapul/login.html',
  '/mangapul/password.html',
  '/mangapul/README.md',
  '/mangapul/register.html',
  '/mangapul/vendor/bootstrap_5.2.3/js/bootstrap.bundle.min.js',
  '/mangapul/vendor/bootstrap_5.2.3/js/bootstrap.bundle.min.js.map',
  '/mangapul/vendor/chart_2.8.0/js/chart.min.js',
  '/mangapul/vendor/fontawesome_6.3.0/js/all.min.js',
  '/mangapul/vendor/simple_datatables_7.1.2/css/style.min.css',
  '/mangapul/vendor/simple_datatables_7.1.2/js/simple-datatables.min.js'
];
// Service Worker Diagnostic. Set true to get console logs.
var APP_DIAG = false;

//Service Worker Function Below.
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			//Adding files to cache
			return cache.addAll(REQUIRED_FILES);
		}).catch(function(error) {
			//Output error if file locations are incorrect
			if(APP_DIAG){console.log('Service Worker Cache: Error Check REQUIRED_FILES array in _service-worker.js - files are missing or path to files is incorrectly written -  ' + error);}
		})
		.then(function() {
			//Install SW if everything is ok
			return self.skipWaiting();
		})
		.then(function(){
			if(APP_DIAG){console.log('Service Worker: Cache is OK');}
		})
	);
	if(APP_DIAG){console.log('Service Worker: Installed');}
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		//Fetch Data from cache if offline
		caches.match(event.request)
			.then(function(response) {
				if (response) {return response;}
				return fetch(event.request);
			}
		)
	);
	if(APP_DIAG){console.log('Service Worker: Fetching '+APP_NAME+'-'+APP_VER+' files from Cache');}
});

self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
	event.waitUntil(
		//Check cache number, clear all assets and re-add if cache number changed
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames
					.filter(cacheName => (cacheName.startsWith(APP_NAME + "-")))
					.filter(cacheName => (cacheName !== CACHE_NAME))
					.map(cacheName => caches.delete(cacheName))
			);
		})
	);
	if(APP_DIAG){console.log('Service Worker: Activated')}
});
