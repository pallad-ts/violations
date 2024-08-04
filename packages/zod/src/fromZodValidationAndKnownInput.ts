import {ViolationsList} from "@pallad/violations";
import {z} from 'zod';
import {Either} from '@sweet-monads/either';
import {fromZodValidation} from "./fromZodValidation";

export function fromZodValidationAndKnownInput<T extends z.ZodSchema<any>>(
	schema: T,
	input: z.input<T>
): Either<ViolationsList, z.infer<T>> {
	return fromZodValidation(schema, input);
}
