import {Violation} from "./Violation";
import {createViolation} from "./createViolation";
import {TypeCheck} from "@pallad/type-check";


function matchesPath(path: string[], searchPath: string[]) {
	return searchPath.every((entry, index) => path[index] === entry);
}

const CHECK = new TypeCheck<ViolationsList>('@pallad/violations/ViolationsList');

export class ViolationsList extends CHECK.clazz {
	private storage: Violation[] = [];

	static create() {
		return new ViolationsList();
	}

	addViolation(message: string, path?: string[] | string, code?: string, params?: any[]): this;
	addViolation(violation: Violation): this;
	addViolation(messageOrViolation: string | Violation, path?: string[] | string, code?: string, params?: any[]): this {
		this.storage.push(typeof messageOrViolation === 'string' ? createViolation(messageOrViolation, path, code, params) : messageOrViolation);
		return this;
	}

	mergeAtPath(
		path: string[] | string,
		violationData: Violation | ViolationsList | undefined
	) {
		const finalPath = Array.isArray(path) ? path : [path];

		this.storage.push(
			...this.extractViolationForMerge(violationData)
				.map(violation => {
					const newPath = finalPath.concat(violation.path ?? []);
					return {
						...violation,
						path: newPath
					};
				})
		);
		return this;
	}

	merge(...violations: Array<Violation | ViolationsList | undefined>): this {
		this.storage.push(
			...violations.flatMap(x => this.extractViolationForMerge(x))
		);
		return this;
	}

	private extractViolationForMerge(violation: Violation | ViolationsList | undefined): Violation[] {
		if (violation) {
			if (ViolationsList.isType(violation)) {
				return violation.getViolations();
			}
			return [violation];
		}

		return [];
	}

	getForPath(path: string[] | string): Violation[] {
		const realPath = Array.isArray(path) ? path : [path];
		return this.storage.filter(v => v.path && matchesPath(v.path, realPath));
	}

	getViolations() {
		return this.storage;
	}

	getListOrNothing() {
		if (this.getViolations().length) {
			return this;
		}
		return undefined;
	}

	get violations() {
		return this.storage;
	}

	get isEmpty() {
		return this.getViolations().length === 0;
	}

	get hasViolations() {
		return !this.isEmpty;
	}
}
