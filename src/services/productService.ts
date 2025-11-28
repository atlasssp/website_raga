import { Product, Category } from '../types';
import { api } from '../lib/api';

export class ProductService {
  static async checkConnection(): Promise<boolean> {
    try {
      await api.products.getAll();
      return true;
    } catch {
      return false;
    }
  }

  static async uploadImage(file: File, folder: string = 'products'): Promise<string> {
    return '/images/products/4.jpg';
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    console.log('Deleting image:', imageUrl);
  }

  static async getCategories(): Promise<Category[]> {
    return api.categories.getAll();
  }

  static getDefaultCategories(): Category[] {
    return [];
  }

  static async createDefaultCategories(): Promise<void> {
  }

  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return api.categories.create(category);
  }

  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    return api.categories.update(id, updates);
  }

  static async deleteCategory(id: string): Promise<void> {
    await api.categories.delete(id);
  }

  static async getProducts(): Promise<Product[]> {
    return api.products.getAll();
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt'>, imageFiles: File[] = []): Promise<Product> {
    if (!productData.name || !productData.price || !productData.category) {
      throw new Error('Name, price, and category are required fields.');
    }

    return api.products.create({
      ...productData,
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['/images/products/4.jpg']
    });
  }

  static async updateProduct(id: string, updates: Partial<Product>, newImageFiles: File[] = []): Promise<Product> {
    return api.products.update(id, updates);
  }

  static async deleteProduct(id: string): Promise<void> {
    await api.products.delete(id);
  }

  static async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    console.log('Deleting product image:', productId, imageUrl);
  }
}