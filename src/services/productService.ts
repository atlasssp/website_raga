import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';

export class ProductService {
  // Upload image to Supabase Storage
  static async uploadImage(file: File, folder: string = 'products'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrl;
  }

  // Delete image from Supabase Storage
  static async deleteImage(imageUrl: string): Promise<void> {
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
  }

  // Fetch all categories
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      image: cat.image_url || '/images/products/4.jpg'
    }));
  }

  // Create category
  static async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
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
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      image: data.image_url || '/images/products/4.jpg'
    };
  }

  // Update category
  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
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
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      image: data.image_url || '/images/products/4.jpg'
    };
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  // Fetch all products with their images and category info
  static async getProducts(): Promise<Product[]> {
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
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    return products.map(product => ({
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
        ?.sort((a, b) => a.sort_order - b.sort_order)
        ?.map(img => img.image_url) || ['/images/products/4.jpg'],
      createdAt: product.created_at
    }));
  }

  // Create product with images
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt'>, imageFiles: File[] = []): Promise<Product> {
    // First, get category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        category_id: category?.id,
        sizes: productData.sizes,
        colors: productData.colors,
        stock: productData.stock,
        featured: productData.featured
      })
      .select()
      .single();

    if (productError) {
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
        await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            image_url: productData.images[i],
            alt_text: productData.name,
            sort_order: i
          });
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
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>, newImageFiles: File[] = []): Promise<Product> {
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
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
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
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  // Delete specific product image
  static async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    // Delete from storage
    await this.deleteImage(imageUrl);

    // Delete from database
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId)
      .eq('image_url', imageUrl);

    if (error) {
      throw new Error(`Failed to delete product image: ${error.message}`);
    }
  }
}