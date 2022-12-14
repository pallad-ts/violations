export function createViolation(message: string, path?: string[] | string, code?: string, params?: any[]) {
	return {
		path: path === undefined ? undefined : (Array.isArray(path) ? path : [path]),
		message,
		code,
		params
	};
}
