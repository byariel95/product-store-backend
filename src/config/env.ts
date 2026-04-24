import { z } from 'zod';
import { logger } from '../utils/logger.js';

const envSchema = z.object({
	PORT: z.coerce.number().int().positive(),
	HOST: z.string().min(1),
	DB_URL: z.url({
		message: 'DB_URL must be a valid MongoDB connection string',
	}),
});

export type Env = z.infer<typeof envSchema>;

const validEnv = envSchema.safeParse(process.env);

if (!validEnv.success) {
	logger.error('\n❌ Error: Invalid environment variables\n');
	logger.error(z.prettifyError(validEnv.error));
	logger.error('\nPlease check your .env file and try again.\n');

	throw new Error('Invalid environment variables');
}

export const env = validEnv.data;
