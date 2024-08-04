import {ViolationsList} from "@pallad/violations";
import {z} from 'zod';
import {Either} from '@sweet-monads/either';
import {fromAsyncZodValidation} from "./fromAsyncZodValidation";

export function fromAsyncZodValidationAndKnownInput<T extends z.ZodSchema<any>>(
	schema: T,
	input: z.input<T>
): Promise<Either<ViolationsList, z.infer<T>>> {
	return fromAsyncZodValidation(schema, input);
}
