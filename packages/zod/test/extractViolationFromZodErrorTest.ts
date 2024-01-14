import {z} from 'zod';
import {extractViolationsFromZodError} from "@src/extractViolationsFromZodError";

describe('extractViolationFromZodError', () => {

	const schema = z.object({
		foo: z.string(),
	}).transform((value, ctx) => {
		if (value.foo !== 'foo') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'foo',
			});
			return z.NEVER;
		}
		return value;
	});


	it.each([
		[{foo: 100}],
		[{foo: 'bar'}]
	])('should return the all issues for input: %s', (input) => {
		const result = schema.safeParse(input);

		if (!result.success) {
			expect(extractViolationsFromZodError(result.error)).toMatchSnapshot();
		}
	})
})
