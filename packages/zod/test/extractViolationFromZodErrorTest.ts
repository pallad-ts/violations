import {z} from 'zod';
import {extractViolationsFromZodError} from "@src/extractViolationsFromZodError";

describe('extractViolationFromZodError', () => {

	const schema = z.object({
		foo: z.string(),
		nested: z.object({
			bar: z.number()
		})
	}).transform((value, ctx) => {
		if (value.foo !== 'foo') {
			ctx.addIssue({
				code: 'custom',
				message: 'foo',
			});
			return z.NEVER;
		}
		return value;
	});


	it.each([
		[{foo: 100}],
		[{foo: 'bar'}],
		[{foo: 'bar', nested: {}}]
	])('should return the all issues for input: %s', (input) => {
		const result = schema.safeParse(input);

		if (!result.success) {
			expect(extractViolationsFromZodError(result.error)).toMatchSnapshot();
		}
	})
})
