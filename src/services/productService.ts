import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';

export class ProductService {
  // Check if Supabase is properly configured
  static async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
  }

  // Upload image to Supabase Storage
  static async uploadImage(file: File, folder: string = 'products'): Promise<string> {
    try {
      // Check if storage is available
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.warn('Storage not available, using placeholder image');
        return '/images/products/4.jpg';
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        return '/images/products/4.jpg';
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Upload image error:', error);
      return '/images/products/4.jpg';
    }
  }

  // Delete image from Supabase Storage
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl.includes('product-images')) return;

      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'product-images');
      if (bucketIndex === -1) return;

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (error) {
        console.error('Failed to delete image:', error);
      }
    } catch (error) {
      console.error('Delete image error:', error);
    }
  }

  // Fetch all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        console.warn('Database not connected, using default categories');
        return this.getDefaultCategories();
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Fetch categories error:', error);
        return this.getDefaultCategories();
      }

      if (!data || data.length === 0) {
        // Create default categories if none exist
        await this.createDefaultCategories();
        return this.getDefaultCategories();
      }

      return data.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        image: cat.image_url || '/images/products/4.jpg'
      }));
    } catch (error) {
      console.error('Get categories error:', error);
      return this.getDefaultCategories();
    }
  }

  // Get default categories
  static getDefaultCategories(): Category[] {
    return [
      { id: 'default-1', name: 'Kurtis', description: 'Beautiful traditional kurtis', image: '/images/products/4.jpg' },
      { id: 'default-2', name: 'Lehengas', description: 'Elegant lehengas', image: '/images/products/9.jpg' },
      { id: 'default-3', name: 'Co-ord Sets', description: 'Trendy coordinated sets', image: '/images/products/10.jpg' },
      { id: 'default-4', name: 'Anarkali Sets', description: 'Classic Anarkali suits', image: '/images/products/11.jpg' },
      { id: 'default-5', name: 'Pure Cottons', description: 'Comfortable pure cotton collections', image: '/images/products/12.jpg' }
    ];
  }

  // Create default categories in database
  static async createDefaultCategories(): Promise<void> {
    try {
      const defaultCategories = this.getDefaultCategories();
      
      for (const category of defaultCategories) {
        await supabase
          .from('categories')
          .insert({
            name: category.name,
            description: category.description,
            image_url: category.image
          })
          .select()
          .single();
      }
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  }

  // Create category
  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection not available. Please check your Supabase configuration.');
      }

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          description: category.description,
          image_url: category.image
        })
        .select()
        .single();

      if (error) {
        console.error('Create category error:', error);
        throw new Error(`Failed to create category: ${error.message}`);
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        image: data.image_url || '/images/products/4.jpg'
      };
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }

  // Update category
  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection not available. Please check your Supabase configuration.');
      }

      const { data, error } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          description: updates.description,
          image_url: updates.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update category error:', error);
        throw new Error(`Failed to update category: ${error.message}`);
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        image: data.image_url || '/images/products/4.jpg'
      };
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection not available. Please check your Supabase configuration.');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete category error:', error);
        throw new Error(`Failed to delete category: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }

  // Fetch all products with their images and category info
  static async getProducts(): Promise<Product[]> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        console.warn('Database not connected, returning empty products list');
        return [];
      }

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          ),
          product_images (
            image_url,
            alt_text,
            sort_order
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Fetch products error:', productsError);
        return [];
      }

      return (products || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.original_price || undefined,
        category: product.categories?.name || 'Uncategorized',
        sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
        colors: product.colors || ['Default'],
        stock: product.stock,
        featured: product.featured,
        images: product.product_images
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          ?.map((img: any) => img.image_url) || ['/images/products/4.jpg'],
        createdAt: product.created_at
      }));
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  }

  // Create product with images
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt'>, imageFiles: File[] = []): Promise<Product> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection not available. Please check your Supabase configuration in the .env file.');
      }

      // Validate required fields
      if (!productData.name || !productData.price || !productData.category) {
        throw new Error('Name, price, and category are required fields.');
      }

      // Get category ID
      let categoryId = null;
      if (productData.category) {
        const { data: category, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', productData.category)
          .single();
        
        if (categoryError) {
          console.warn('Category not found, creating new category');
          // Create category if it doesn't exist
          const newCategory = await this.createCategory({
            name: productData.category,
            description: `${productData.category} collection`,
            image: '/images/products/4.jpg'
          });
          categoryId = newCategory.id;
        } else {
          categoryId = category?.id;
        }
      }

      // Create product
      const productInsert = {
        name: productData.name.trim(),
        description: productData.description?.trim() || '',
        price: Number(productData.price),
        original_price: productData.originalPrice ? Number(productData.originalPrice) : null,
        category_id: categoryId,
        sizes: productData.sizes && productData.sizes.length > 0 ? productData.sizes : ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
        colors: productData.colors && productData.colors.length > 0 ? productData.colors : ['Default'],
        stock: Number(productData.stock) || 0,
        featured: Boolean(productData.featured)
      };

      console.log('Creating product with data:', productInsert);

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productInsert)
        .select()
        .single();

      if (productError) {
        console.error('Create product error:', productError);
        throw new Error(`Failed to create product: ${productError.message}`);
      }

      console.log('Product created successfully:', product);

      // Upload images if provided
      const imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        console.log('Uploading images:', imageFiles.length);
        for (let i = 0; i < imageFiles.length; i++) {
          try {
            const imageUrl = await this.uploadImage(imageFiles[i]);
            imageUrls.push(imageUrl);

            // Save image record
            const { error: imageError } = await supabase
              .from('product_images')
              .insert({
                product_id: product.id,
                image_url: imageUrl,
                alt_text: productData.name,
                sort_order: i
              });

            if (imageError) {
              console.error('Failed to save image record:', imageError);
            }
          } catch (error) {
            console.error('Failed to upload image:', error);
          }
        }
      } else if (productData.images && productData.images.length > 0) {
        // Use existing image URLs
        for (let i = 0; i < productData.images.length; i++) {
          try {
            const { error: imageError } = await supabase
              .from('product_images')
              .insert({
                product_id: product.id,
                image_url: productData.images[i],
                alt_text: productData.name,
                sort_order: i
              });

            if (imageError) {
              console.error('Failed to save image record:', imageError);
            } else {
              imageUrls.push(productData.images[i]);
            }
          } catch (error) {
            console.error('Failed to save image record:', error);
          }
        }
      }

      // If no images were uploaded, use default
      if (imageUrls.length === 0) {
        imageUrls.push('/images/products/4.jpg');
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.original_price || undefined,
        category: productData.category,
        sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
        colors: product.colors || ['Default'],
        stock: product.stock,
        featured: product.featured,
        images: imageUrls,
        createdAt: product.created_at
      };
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>, newImageFiles: File[] = []): Promise<Product> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection not available. Please check your Supabase configuration.');
      }

      // Get category ID if category is being updated
      let categoryId: string | undefined;
      if (updates.category) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', updates.category)
          .single();
        categoryId = category?.id;
      }

      // Update product
      const { data: product, error: productError } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          original_price: updates.originalPrice,
          category_id: categoryId,
          sizes: updates.sizes,
          colors: updates.colors,
          stock: updates.stock,
          featured: updates.featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (productError) {
        console.error('Update product error:', productError);
        throw new Error(`Failed to update product: ${productError.message}`);
      }

      // Handle new image uploads
      if (newImageFiles.length > 0) {
        // Get current max sort order
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('sort_order')
          .eq('product_id', id)
          .order('sort_order', { ascending: false })
          .limit(1);

        const maxSortOrder = existingImages?.[0]?.sort_order || -1;

        // Upload new images
        for (let i = 0; i < newImageFiles.length; i++) {
          try {
            const imageUrl = await this.uploadImage(newImageFiles[i]);
            
            await supabase
              .from('product_images')
              .insert({
                product_id: id,
                image_url: imageUrl,
                alt_text: updates.name || product.name,
                sort_order: maxSortOrder + i + 1
              });
          } catch (error) {
            console.error('Failed to upload image:', error);
          }
        }
      }

      // Fetch updated product with images
      const updatedProducts = await this.getProducts();
      const updatedProduct = updatedProducts.find(p => p.id === id);
      
      if (!updatedProduct) {
        throw new Error('Failed to fetch updated product');
      }

      return updatedProduct;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection not available. Please check your Supabase configuration.');
      }

      // Get product images to delete from storage
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', id);

      // Delete images from storage
      if (images) {
        for (const image of images) {
          await this.deleteImage(image.image_url);
        }
      }

      // Delete product (images will be deleted by cascade)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete product error:', error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  // Delete specific product image
  static async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    try {
      // Delete from storage
      await this.deleteImage(imageUrl);

      // Delete from database
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId)
        .eq('image_url', imageUrl);

      if (error) {
        console.error('Delete product image error:', error);
        throw new Error(`Failed to delete product image: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete product image error:', error);
      throw error;
    }
  }
}