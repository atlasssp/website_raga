import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  auth: {
    signup: async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      return response.json();
    },

    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    },

    logout: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return response.json();
    },
  },

  products: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          product_images(image_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((product: any) => ({
        ...product,
        category: product.categories?.name || '',
        images: product.product_images?.map((img: any) => img.image_url) || []
      }));
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          product_images(image_url)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Product not found');

      return {
        ...data,
        category: data.categories?.name || '',
        images: data.product_images?.map((img: any) => img.image_url) || []
      };
    },

    create: async (productData: any) => {
      const { images, category, ...productInfo } = productData;

      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .maybeSingle();

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          ...productInfo,
          category_id: categoryData?.id
        })
        .select()
        .single();

      if (productError) throw productError;

      if (images && images.length > 0) {
        const imageInserts = images.map((url: string) => ({
          product_id: product.id,
          image_url: url
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      return { ...product, category, images: images || [] };
    },

    update: async (id: string, productData: any) => {
      const { images, category, ...productInfo } = productData;

      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .maybeSingle();

      const { data: product, error: productError } = await supabase
        .from('products')
        .update({
          ...productInfo,
          category_id: categoryData?.id
        })
        .eq('id', id)
        .select()
        .single();

      if (productError) throw productError;

      if (images) {
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', id);

        if (images.length > 0) {
          const imageInserts = images.map((url: string) => ({
            product_id: id,
            image_url: url
          }));

          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(imageInserts);

          if (imagesError) throw imagesError;
        }
      }

      return { ...product, category, images: images || [] };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },

    create: async (categoryData: any) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (id: string, categoryData: any) => {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  orders: {
    create: async (orderData: any) => {
      const { items, ...orderInfo } = orderData;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderInfo)
        .select()
        .single();

      if (orderError) throw orderError;

      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      return order;
    },

    getAll: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name, product_images(image_url))
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Order not found');
      return data;
    },

    updateStatus: async (id: string, status: string) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
};
