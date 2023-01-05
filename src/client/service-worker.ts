/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener(
	'install',
	(event) => {
		// console.log(
		// 	'[Service Worker]: Installing...',
		// 	event,
		// );
	},
);

self.addEventListener(
	'activate',
	(event) => {
		// console.log(
		// 	'[Service Worker] Activating...',
		// 	event,
		// );
		return self.clients.claim();
	},
);

// self.addEventListener(
// 	'fetch',
// 	(event) => {
// 		console.log(
// 			`[Service Worker]: Fetching ${event.request.url}...`,
// 			event,
// 		);
//		doesn't do anything
//		event.respondWith(fetch(event.request));
// 	},
// );
