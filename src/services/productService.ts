import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';

export class ProductService {
  // Upload image to Supabase Storage
  static async uploadImage(file: File, folder: string = 'products'): Promise<string> {
    try {
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
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Upload image error:', error);
      // Return a placeholder image URL if upload fails
      return '/images/products/4.jpg';
    }
  }

  // Delete image from Supabase Storage
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Fetch categories error:', error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return (data || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        image: cat.image_url || '/images/products/4.jpg'
      }));
    } catch (error) {
      console.error('Get categories error:', error);
      // Return default categories if database fails
      return [
        { id: '1', name: 'Kurtis', description: 'Beautiful traditional kurtis', image: '/images/products/4.jpg' },
        { id: '2', name: 'Lehengas', description: 'Elegant lehengas', image: '/images/products/9.jpg' },
        { id: '3', name: 'Co-ord Sets', description: 'Trendy coordinated sets', image: '/images/products/10.jpg' }
      ];
    }
  }

  // Create category
  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
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
        throw new Error(`Failed to fetch products: ${productsError.message}`);
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
      // Return empty array if database fails
      return [];
    }
  }

  // Create product with images
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt'>, imageFiles: File[] = []): Promise<Product> {
    try {
      // First, get category ID
      let categoryId = null;
      if (productData.category) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', productData.category)
          .single();
        categoryId = category?.id;
      }

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          original_price: productData.originalPrice,
          category_id: categoryId,
          sizes: productData.sizes,
          colors: productData.colors,
          stock: productData.stock,
          featured: productData.featured
        })
        .select()
        .single();

      if (productError) {
        console.error('Create product error:', productError);
        throw new Error(`Failed to create product: ${productError.message}`);
      }

      // Upload images if provided
      const imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          try {
            const imageUrl = await this.uploadImage(imageFiles[i]);
            imageUrls.push(imageUrl);

            // Save image record
            await supabase
              .from('product_images')
              .insert({
                product_id: product.id,
                image_url: imageUrl,
                alt_text: productData.name,
                sort_order: i
              });
          } catch (error) {
            console.error('Failed to upload image:', error);
          }
        }
      } else if (productData.images.length > 0) {
        // Use existing image URLs
        for (let i = 0; i < productData.images.length; i++) {
          try {
            await supabase
              .from('product_images')
              .insert({
                product_id: product.id,
                image_url: productData.images[i],
                alt_text: productData.name,
                sort_order: i
              });
          } catch (error) {
            console.error('Failed to save image record:', error);
          }
        }
        imageUrls.push(...productData.images);
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
        images: imageUrls.length > 0 ? imageUrls : ['/images/products/4.jpg'],
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