export default class DB {
	getProperty(key) {
		return new Promise(async (resolve, reject) => {
			const db = await DB._open();
			const request = db.transaction(["properties"], "readonly")
				.objectStore("properties")
				.get(key);
			request.onsuccess = event => resolve(event.target.result && event.target.result.value);
			request.onerror = reject;
		});
	}

	setProperty(key, value) {
		return new Promise(async (resolve, reject) => {
			const db = await DB._open();
			const transaction = db.transaction(["properties"], "readwrite");
			transaction.oncomplete = resolve;
			transaction.onerror = reject;

			transaction.objectStore("properties").put({ key, value });
		});
	}

	storeData(rooms, speakers, talks) {
		return new Promise(async (resolve, reject) => {
			const db = await DB._open();
			const transaction = db.transaction(["rooms", "speakers", "talks"], "readwrite");
			transaction.oncomplete = resolve;
			transaction.onerror = reject;

			DB._putAll(transaction.objectStore("rooms"), rooms);
			DB._putAll(transaction.objectStore("speakers"), speakers);
			DB._putAll(transaction.objectStore("talks"), talks);
		});
	}

	getRooms() {
		return DB._getAll("rooms");
	}

	getSpeakers() {
		return DB._getAll("speakers");
	}

	getTalks() {
		return DB._getAll("talks");
	}

	static _getAll(storeName) {
		return new Promise(async (resolve, reject) => {
			const db = await DB._open();
			const request = db.transaction([storeName], "readonly")
				.objectStore(storeName)
				.getAll();
			request.onsuccess = event => resolve(event.target.result);
			request.onerror = reject;
		});
	}

	static _put(store, data) {
		return new Promise((resolve, reject) => {
			const request = store.put(data);
			request.onsuccess = resolve;
			request.onerror = reject;
		});
	}

	static _putAll(store, data) {
		return Promise.all(data.map(x => DB._put(store, x)));
	}

	static _open() {
		if (!DB._db) {
			DB._db = new Promise((resolve, reject) => {
				const openRequest = indexedDB.open("devoxx-be-2017", 1);
				openRequest.onupgradeneeded = event => DB._upgrade(event);
				openRequest.onerror = reject;
				openRequest.onsuccess = event => resolve(event.target.result);
			});
		}

		return DB._db;
	}

	static _upgrade({ oldVersion, target: { result: db}}) {
		if (oldVersion <= 1) {
			db.createObjectStore("properties", { keyPath: "key" });
			db.createObjectStore("talks", { keyPath: "id" });
			db.createObjectStore("speakers", { keyPath: "id" });
			db.createObjectStore("rooms", { keyPath: "id" });
		}
	}
}