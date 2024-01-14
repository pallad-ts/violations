import {ViolationsList} from "@pallad/violations";
import {Either, right, left} from '@sweet-monads/either';
import {z} from 'zod';
import {convertZodErrorToViolationsList} from "./convertZodErrorToViolationsList.ts";

export function fromZodValidation<T extends z.ZodSchema<any>>(
	schema: T,
	input: unknown
): Either<ViolationsList, z.infer<T>> {
	const result = schema.safeParse(input);
	if (result.success) {
		return right(result.data);
	}
	return left(convertZodErrorToViolationsList(result.error));
}
