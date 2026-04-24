import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { httpResponseSuccess } from '../../utils/httpResponses.js';
import {
	CreateProductSchema,
	DeleteProductSchema,
	GetAllProductsSchema,
	UpdateProductSchema,
} from './products.schema.js';
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	updateProduct,
} from './products.service.js';

const productsRoutes: FastifyPluginAsyncZod = async (app) => {
	app.get('/', GetAllProductsSchema, async (request, reply) => {
		const products = await getAllProducts(request.query);
		return reply.status(200).send(httpResponseSuccess(products));
	});

	app.post('/', CreateProductSchema, async (request, reply) => {
		const newProduct = await createProduct(request.body);
		return reply
			.status(201)
			.send(httpResponseSuccess(newProduct, 'Product created successfully'));
	});

	app.put('/:id', UpdateProductSchema, async (request, reply) => {
		const { id } = request.params as { id: string };
		const updatedProduct = await updateProduct(id, request.body);
		return reply
			.status(200)
			.send(
				httpResponseSuccess(updatedProduct, 'Product updated successfully'),
			);
	});

	app.delete('/:id', DeleteProductSchema, async (request, reply) => {
		const { id } = request.params as { id: string };
		await deleteProduct(id);
		return reply
			.status(200)
			.send(httpResponseSuccess(null, 'Product deleted successfully'));
	});
};

export default productsRoutes;
