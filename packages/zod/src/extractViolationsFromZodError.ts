import {z} from 'zod';
import {createViolation} from "@pallad/violations";

export function extractViolationsFromZodError(error: z.ZodError) {
	return Array.from(violationsFromZodError(error));
}

function* violationsFromZodError(error: z.ZodError) {
	for (const issue of error.issues) {
		yield createViolation(issue.message, issue.path.map(x => x.toString()), issue.code);
	}
}