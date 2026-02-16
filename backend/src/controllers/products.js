import { executeQuery } from '../config/database.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await executeQuery('SELECT * FROM products WHERE deleted = FALSE ORDER BY createdAt DESC');
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const products = await executeQuery('SELECT * FROM products WHERE id = ? AND deleted = FALSE', [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product: products[0] });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await executeQuery(
      'INSERT INTO products (name, description, price, stock, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, description || null, price, stock, category || 'General']
    );

    const createdProduct = await executeQuery('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Product created successfully',
      product: createdProduct[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    // Check if product exists
    const existingProduct = await executeQuery('SELECT id FROM products WHERE id = ? AND deleted = FALSE', [id]);

    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (stock !== undefined) {
      updates.push('stock = ?');
      values.push(stock);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(id);

    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    await executeQuery(query, values);

    const updatedProduct = await executeQuery('SELECT * FROM products WHERE id = ?', [id]);

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await executeQuery('SELECT id FROM products WHERE id = ? AND deleted = FALSE', [id]);

    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete
    await executeQuery('UPDATE products SET deleted = TRUE, updatedAt = NOW() WHERE id = ?', [id]);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const products = await executeQuery(
      'SELECT * FROM products WHERE category = ? AND deleted = FALSE',
      [category]
    );

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await executeQuery(
      'SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?) AND deleted = FALSE',
      [`%${query}%`, `%${query}%`]
    );

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};
