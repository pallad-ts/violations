import {z} from 'zod';
import {ViolationsList} from "@pallad/violations";
import {extractViolationsFromZodError} from "./extractViolationsFromZodError";

export function convertZodErrorToViolationsList(error: z.ZodError) {
	return ViolationsList.create().merge(...extractViolationsFromZodError(error));
}
