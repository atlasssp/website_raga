import { Product, Category } from '../types';
import { products as mockProducts, categories as mockCategories } from '../data/mockData';

// In-memory data store (replace with your preferred database)
let productsStore: Product[] = [...mockProducts];
let categoriesStore: Category[] = [...mockCategories];

export class ProductService {
  // Check connection (always true for in-memory store)
  static async checkConnection(): Promise<boolean> {
    return true;
  }

  // Upload image (mock implementation)
  static async uploadImage(file: File, folder: string = 'products'): Promise<string> {
    // Mock image upload - returns a placeholder URL
    // Replace with your preferred image storage solution
    return '/images/products/4.jpg';
  }

  // Delete image (mock implementation)
  static async deleteImage(imageUrl: string): Promise<void> {
    // Mock image deletion
    console.log('Mock: Deleting image:', imageUrl);
  }

  // Fetch all categories
  static async getCategories(): Promise<Category[]> {
    return [...categoriesStore];
  }

  // Get default categories
  static getDefaultCategories(): Category[] {
    return [...mockCategories];
  }

  // Create default categories (no-op for in-memory)
  static async createDefaultCategories(): Promise<void> {
    // No-op for in-memory store
  }

  // Create category
  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      ...category
    };
    
    categoriesStore.push(newCategory);
    return newCategory;
  }

  // Update category
  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const index = categoriesStore.findIndex(cat => cat.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }

    categoriesStore[index] = { ...categoriesStore[index], ...updates };
    return categoriesStore[index];
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    categoriesStore = categoriesStore.filter(cat => cat.id !== id);
  }

  // Fetch all products
  static async getProducts(): Promise<Product[]> {
    return [...productsStore];
  }

  // Create product
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt'>, imageFiles: File[] = []): Promise<Product> {
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      throw new Error('Name, price, and category are required fields.');
    }

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...productData,
      images: productData.images && productData.images.length > 0 
        ? productData.images 
        : ['/images/products/4.jpg']
    };

    productsStore.push(newProduct);
    return newProduct;
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>, newImageFiles: File[] = []): Promise<Product> {
    const index = productsStore.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }

    productsStore[index] = { ...productsStore[index], ...updates };
    return productsStore[index];
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    productsStore = productsStore.filter(product => product.id !== id);
  }

  // Delete specific product image
  static async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    const product = productsStore.find(p => p.id === productId);
    if (product) {
      product.images = product.images.filter(img => img !== imageUrl);
    }
  }
}