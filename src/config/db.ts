import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { env } from './env.js';

const connectDB = async () => {
	try {
		const mongoURI = env.DB_URL;
		await mongoose.connect(mongoURI);
		logger.info('Connected to database');
	} catch (error) {
		logger.error(error, 'Failed to connect to database');
		process.exit(1);
	}
};

export default connectDB;
