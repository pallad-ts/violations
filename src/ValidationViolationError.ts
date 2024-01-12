import {ViolationsList} from "./ViolationsList";

export class ValidationViolationError extends Error {
	constructor(readonly violationList: ViolationsList, message?: string) {
		super(message ?? 'Validation rules violated');
		this.name = 'ValidationViolationError';
	}
}
