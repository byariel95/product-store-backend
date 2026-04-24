import dns from 'node:dns/promises';
import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
	try {
		dns.setServers(['1.1.1.1']);
		await connectDB();
		await app.listen({ port: env.PORT, host: env.HOST });
		logger.info(`Server running on http://${env.HOST}:${env.PORT}/docs`);
	} catch (err) {
		logger.fatal({ err }, 'Error starting server');
		process.exit(1);
	}
};

startServer();
