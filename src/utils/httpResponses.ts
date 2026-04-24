import z from 'zod';

export const responseSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		message: z.string(),
		data: dataSchema,
		timestamp: z.date(),
		errorCode: z.number(),
	});

export const responseErrorSchema = () =>
	z.object({
		message: z.string(),
		data: z.null(),
		timestamp: z.date(),
		errorCode: z.number(),
	});

export function httpResponseSuccess<T>(
	data: T,
	message = 'Success',
	errorCode = 0,
	date = new Date(),
) {
	return {
		message,
		data,
		timestamp: date,
		errorCode,
	};
}

export function httpResponseError(
	message = 'Error',
	errorCode = -1,
	date = new Date(),
) {
	return {
		message,
		data: null,
		timestamp: date,
		errorCode,
	};
}
