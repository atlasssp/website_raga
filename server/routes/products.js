import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await query(`
      SELECT p.*,
        GROUP_CONCAT(pi.image_url) as images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const products = await query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const images = await query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [req.params.id]
    );

    const product = {
      ...products[0],
      images: images.map(img => img.image_url)
    };

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, images } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const result = await query(
      `INSERT INTO products (name, description, price, category, stock, featured)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || '', price, category, stock || 0, featured || false]
    );

    const productId = result.insertId;

    if (images && images.length > 0) {
      const imageValues = images.map(img => [productId, img]);
      await query(
        'INSERT INTO product_images (product_id, image_url) VALUES ?',
        [imageValues]
      );
    }

    const newProduct = await query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    const productImages = await query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [productId]
    );

    res.status(201).json({
      ...newProduct[0],
      images: productImages.map(img => img.image_url)
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, images } = req.body;

    await query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, category = ?, stock = ?, featured = ?
       WHERE id = ?`,
      [name, description, price, category, stock, featured, req.params.id]
    );

    if (images) {
      await query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);

      if (images.length > 0) {
        const imageValues = images.map(img => [req.params.id, img]);
        await query(
          'INSERT INTO product_images (product_id, image_url) VALUES ?',
          [imageValues]
        );
      }
    }

    const updatedProduct = await query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    const productImages = await query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [req.params.id]
    );

    res.json({
      ...updatedProduct[0],
      images: productImages.map(img => img.image_url)
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
    await query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
