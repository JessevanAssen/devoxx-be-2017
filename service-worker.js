this.addEventListener("install", event => {
	event.waitUntil(
		caches.open("v1")
			.then(cache => cache.addAll([
				"./",
				"./build.js",
				"./index.html",
				"./OpenSans-Bold.ttf",
				"./OpenSans-Regular.ttf"
			]))
	);
});

this.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => response || fetch(event.request))
	);
});
