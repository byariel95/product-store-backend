import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import {
	AppError,
	DatabaseError,
	NotFoundError,
	ValidationError,
} from './errors.js';
import { httpResponseError } from './httpResponses.js';
import { logger } from './logger.js';

export function errorHandler(
	error: FastifyError | AppError | Error,
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	if (error instanceof NotFoundError) {
		return reply
			.status(error.statusCode)
			.send(httpResponseError(error.message, error.errorCode));
	}

	if (error instanceof ValidationError) {
		return reply
			.status(error.statusCode)
			.send(httpResponseError(error.message, error.errorCode));
	}

	if (error instanceof DatabaseError) {
		return reply
			.status(error.statusCode)
			.send(httpResponseError(error.message, error.errorCode));
	}

	if (error instanceof AppError) {
		return reply
			.status(error.statusCode)
			.send(httpResponseError(error.message, error.errorCode));
	}

	// Errores de validacion de Fastify (por ejemplo, Zod)
	if ('validation' in error && error.validation) {
		return reply.status(400).send(httpResponseError(error.message, 400));
	}

	// Error generico no manejado
	logger.error(error, 'Unhandled error');
	return reply
		.status(500)
		.send(httpResponseError('Internal server error', 500));
}
