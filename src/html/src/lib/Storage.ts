class Storage {
	static set = (key: string, value: any) => {
		localStorage.setItem(key, JSON.stringify(value));
	}

	static get = (key: string) => {
		const value = localStorage.getItem(key);
		if (value) return JSON.parse(value);
		return null;
	}

	static remove = (key: string) => {
		localStorage.removeItem(key);
	}
}

export default Storage;
