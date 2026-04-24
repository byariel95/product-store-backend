import { z } from 'zod';

import {
	responseErrorSchema,
	responseSuccessSchema,
} from '../../utils/httpResponses.js';

export const productSchema = z.object({
	name: z.string(),
	price: z.number(),
	image: z.string(),
	_id: z.union([z.string(), z.any()]),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createProductBodySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	price: z.number().positive('Price must be a positive number'),
	image: z.url('Image must be a valid URL'),
});

export const getAllProductsQuerySchema = z.object({
	page: z.coerce.number().positive().optional(),
	limit: z.coerce.number().positive().optional(),
	search: z.string().optional(),
	minPrice: z.coerce.number().nonnegative().optional(),
	maxPrice: z.coerce.number().nonnegative().optional(),
});

export const updateProductBodySchema = z.object({
	name: z.string().min(1, 'Name is required').optional(),
	price: z.number().positive('Price must be a positive number').optional(),
	image: z.string().url('Image must be a valid URL').optional(),
});

export const productParamsSchema = z.object({
	id: z.string().min(1, 'Product ID is required'),
});

export const GetAllProductsSchema = {
	schema: {
		summary: 'Endpoint to get All Products',
		tags: ['Products'],
		description:
			'get all products from the database. Supports optional pagination (page, limit) and filters (search, minPrice, maxPrice). If no pagination params are provided, returns all records.',
		querystring: getAllProductsQuerySchema,
		response: {
			200: responseSuccessSchema(z.array(productSchema)),
			400: responseErrorSchema(),
			500: responseErrorSchema(),
		},
	},
};

export const CreateProductSchema = {
	schema: {
		summary: 'Endpoint to create a Product',
		tags: ['Products'],
		description: 'create a new product in the database',
		body: createProductBodySchema,
		response: {
			201: responseSuccessSchema(productSchema),
			400: responseErrorSchema(),
			500: responseErrorSchema(),
		},
	},
};

export const UpdateProductSchema = {
	schema: {
		summary: 'Endpoint to update a Product',
		tags: ['Products'],
		description: 'update an existing product by ID',
		params: productParamsSchema,
		body: updateProductBodySchema,
		response: {
			200: responseSuccessSchema(productSchema),
			400: responseErrorSchema(),
			404: responseErrorSchema(),
			500: responseErrorSchema(),
		},
	},
};

export const DeleteProductSchema = {
	schema: {
		summary: 'Endpoint to delete a Product',
		tags: ['Products'],
		description: 'delete a product by ID',
		params: productParamsSchema,
		response: {
			200: responseSuccessSchema(z.null()),
			400: responseErrorSchema(),
			404: responseErrorSchema(),
			500: responseErrorSchema(),
		},
	},
};
