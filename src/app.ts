import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import fastify from 'fastify';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import routes from './routes/index.js';
import { errorHandler } from './utils/errorHandler.js';
import { logger } from './utils/logger.js';

const app = fastify({
	loggerInstance: logger,
	disableRequestLogging: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifyCors, {
	origin: '*',
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'API - Product Store',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
});

app.register(scalarAPIReference, {
	routePrefix: '/docs',
});

app.get('/', async (request, reply) => {
	return reply.status(200).send({
		message: `Api Works!! made with ❤️`,
		host: request.hostname,
		date: new Date().toISOString(),
		ipAddress: request.ip,
	});
});

app.register(routes, { prefix: '/api' });

export default app;
