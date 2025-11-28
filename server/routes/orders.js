import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const result = await query(
      `INSERT INTO orders (user_id, total, status, shipping_address, payment_method)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, total, 'pending', JSON.stringify(shippingAddress), paymentMethod || 'cod']
    );

    const orderId = result.insertId;

    const orderItemValues = items.map(item => [
      orderId,
      item.productId,
      item.quantity,
      item.price
    ]);

    await query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
      [orderItemValues]
    );

    const newOrder = await query(
      `SELECT o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'productId', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', p.name
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = ?
       GROUP BY o.id`,
      [orderId]
    );

    res.status(201).json(newOrder[0]);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      orders = await query(`
        SELECT o.*,
          u.name as user_name,
          u.email as user_email,
          GROUP_CONCAT(
            JSON_OBJECT(
              'productId', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'name', p.name
            )
          ) as items
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `);
    } else {
      orders = await query(`
        SELECT o.*,
          GROUP_CONCAT(
            JSON_OBJECT(
              'productId', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'name', p.name
            )
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `, [req.user.id]);
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orders = await query(`
      SELECT o.*,
        u.name as user_name,
        u.email as user_email,
        GROUP_CONCAT(
          JSON_OBJECT(
            'productId', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id
    `, [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    const updatedOrder = await query(
      'SELECT * FROM orders WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
