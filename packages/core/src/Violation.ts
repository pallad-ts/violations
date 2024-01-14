export interface Violation {
	path?: string[];
	code?: string;
	message: string;
	params?: any[];
}
