import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import productsRoutes from '../modules/products/products.route.js';

const routes: FastifyPluginAsyncZod = async (app) => {
	app.register(productsRoutes, { prefix: '/products' });
};

export default routes;
