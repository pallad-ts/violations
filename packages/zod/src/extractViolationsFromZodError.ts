import {z} from 'zod';
import {createViolation} from "@pallad/violations";

export function extractViolationsFromZodError(error: z.ZodError) {
	return Array.from(violationsFromZodError(error));
}

function* violationsFromZodError(error: z.ZodError) {
	const flattenErrors = error.flatten();
	for (const [field, errors] of Object.entries(flattenErrors.fieldErrors)) {
		if (errors) {
			for (const error of errors) {
				yield createViolation(error, field);
			}
		}
	}

	for (const error of flattenErrors.formErrors) {
		yield createViolation(error);
	}
}
