export class AppError extends Error {
	public readonly statusCode: number;
	public readonly errorCode: number;

	constructor(
		message: string,
		statusCode: number = 500,
		errorCode: number = -1,
	) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(message, 404, 404);
	}
}

export class ValidationError extends AppError {
	constructor(message: string = 'Validation error') {
		super(message, 400, 400);
	}
}

export class DatabaseError extends AppError {
	constructor(message: string = 'Database error') {
		super(message, 500, 500);
	}
}
