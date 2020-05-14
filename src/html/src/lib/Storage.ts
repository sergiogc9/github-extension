class Storage {
	static set = async (key: string, value: any) => {
		await new Promise(resolve => {
			chrome.storage.sync.set({ [key]: JSON.stringify(value) }, resolve);
		});
	}

	static get = async (key: string) => {
		const items: any = await new Promise(resolve => {
			chrome.storage.sync.get(key, items => resolve(items));
		});
		return items[key] ? JSON.parse(items[key]) : null;
	}

	static remove = async (key: string) => {
		await new Promise(resolve => chrome.storage.sync.remove(key, resolve));
	}
}

export default Storage;
