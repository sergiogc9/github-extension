class Log {
	// eslint-disable-next-line no-console
	static info = (...args: Parameters<typeof console.log>) => console.log(args);
	// eslint-disable-next-line no-console
	static warn = (...args: Parameters<typeof console.warn>) => console.warn(args);
	// eslint-disable-next-line no-console
	static error = (...args: Parameters<typeof console.error>) => console.error(args);
}

export default Log;
