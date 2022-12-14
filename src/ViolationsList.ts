import {Violation} from "./Violation";
import {createViolation} from "./createViolation";
import {TypeCheck} from "@pallad/type-check";


function matchesPath(path: string[], searchPath: string[]) {
	return searchPath.every((entry, index) => path[index] === entry);
}

const CHECK = new TypeCheck<ViolationsList>('@pallad/violations/ViolationsList');

export class ViolationsList extends CHECK.clazz {
	private violations: Violation[] = [];

	static create() {
		return new ViolationsList();
	}

	addViolation(message: string, path?: string[] | string, code?: string, params?: any[]): this;
	addViolation(violation: Violation): this;
	addViolation(messageOrViolation: string | Violation, path?: string[] | string, code?: string, params?: any[]): this {
		this.violations.push(typeof messageOrViolation === 'string' ? createViolation(messageOrViolation, path, code, params) : messageOrViolation);
		return this;
	}

	mergeAtPath(
		path: string[] | string,
		violationData: Violation | ViolationsList | undefined
	) {
		const finalPath = Array.isArray(path) ? path : [path];

		this.violations.push(
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
		this.violations.push(
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
		return this.violations.filter(v => v.path && matchesPath(v.path, realPath));
	}

	getViolations() {
		return this.violations;
	}

	getListOrNothing() {
		if (this.getViolations().length) {
			return this;
		}
		return undefined;
	}
}
