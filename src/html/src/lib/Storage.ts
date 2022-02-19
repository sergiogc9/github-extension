class Storage {
	static set = async (key: string, value: any) => {
		await new Promise(resolve => {
			chrome.storage.local.set({ [key]: JSON.stringify(value) }, resolve as any);
		});
	};

	static get = async (key: string) => {
		const items: any = await new Promise(resolve => {
			chrome.storage.local.get(key, currentItems => resolve(currentItems));
		});
		return items && items[key] ? JSON.parse(items[key]) : null;
	};

	static remove = async (key: string) => {
		await new Promise(resolve => chrome.storage.local.remove(key, resolve as any));
	};
}

export default Storage;
