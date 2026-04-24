import { Product } from '../../models/index.js';
import { DatabaseError, NotFoundError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

type ProductBody = {
	name: string;
	price: number;
	image: string;
};

export async function createProduct(values: ProductBody) {
	try {
		const newProduct = new Product(values);
		await newProduct.save();
		return newProduct;
	} catch (error) {
		logger.error(error, 'Error creating product');
		throw new DatabaseError('Error creating product');
	}
}

type GetAllProductsQuery = {
	page?: number;
	limit?: number;
	search?: string;
	minPrice?: number;
	maxPrice?: number;
};

export async function getAllProducts(query?: GetAllProductsQuery) {
	try {
		const filter: Record<string, unknown> = {};

		if (query?.search) {
			filter.name = { $regex: query.search, $options: 'i' };
		}

		if (query?.minPrice !== undefined || query?.maxPrice !== undefined) {
			filter.price = {};
			if (query.minPrice !== undefined) {
				(filter.price as Record<string, number>).$gte = query.minPrice;
			}
			if (query.maxPrice !== undefined) {
				(filter.price as Record<string, number>).$lte = query.maxPrice;
			}
		}

		let mongooseQuery = Product.find(filter).sort({ createdAt: -1 });

		if (query?.page && query?.limit) {
			const skip = (query.page - 1) * query.limit;
			mongooseQuery = mongooseQuery.skip(skip).limit(query.limit);
		}

		const products = await mongooseQuery;
		return products;
	} catch (error) {
		logger.error(error, 'Error to get products');
		throw new DatabaseError('Error to get products');
	}
}

type UpdateProductBody = Partial<ProductBody>;

export async function updateProduct(id: string, values: UpdateProductBody) {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, values, {
			new: true,
			runValidators: true,
		});

		if (!updatedProduct) {
			throw new NotFoundError('Product not found');
		}

		return updatedProduct;
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}
		logger.error(error, 'Error updating product');
		throw new DatabaseError('Error updating product');
	}
}

export async function deleteProduct(id: string) {
	try {
		const deletedProduct = await Product.findByIdAndDelete(id);

		if (!deletedProduct) {
			throw new NotFoundError('Product not found');
		}

		return deletedProduct;
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}
		logger.error(error, 'Error deleting product');
		throw new DatabaseError('Error deleting product');
	}
}
