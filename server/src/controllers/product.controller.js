import Product from '../models/Product.model.js';
import { mockProducts } from '../data/mockData.js';

// Check if MongoDB is connected
const isMongoConnected = () => {
  try {
    return Product.db && Product.db.readyState === 1;
  } catch {
    return false;
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      console.log('⚠️  Using mock data - MongoDB not connected');
      const {
        page = 1,
        limit = 12,
        category,
        search,
        sort = '-createdAt'
      } = req.query;

      let filteredProducts = [...mockProducts];

      // Apply filters
      if (category && category !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (sort === 'price') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sort === '-price') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sort === '-averageRating') {
        filteredProducts.sort((a, b) => b.averageRating - a.averageRating);
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return res.json({
        success: true,
        data: {
          products: paginatedProducts,
          totalPages: Math.ceil(filteredProducts.length / limit),
          currentPage: Number(page),
          totalProducts: filteredProducts.length
        }
      });
    }

    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        totalProducts: count
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch products'
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const product = mockProducts.find(p => p._id === req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      return res.json({
        success: true,
        data: { product }
      });
    }

    const product = await Product.findById(req.params.id)
      .populate('ratings.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    // Validate price and stock
    if (req.body.price && req.body.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }
    
    if (req.body.stock && req.body.stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // Validate price and stock
    if (req.body.price !== undefined && req.body.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }
    
    if (req.body.stock !== undefined && req.body.stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product'
    });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Import Order model dynamically to avoid circular dependency
    const Order = (await import('../models/Order.model.js')).default;

    // Check if user has received this product
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      'products.product': req.params.id,
      orderStatus: 'delivered'
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have received'
      });
    }

    // Add review
    product.ratings.push({
      user: req.user._id,
      rating,
      comment
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review'
    });
  }
};

export const getTopRatedProducts = async (req, res) => {
  try {
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const topProducts = [...mockProducts]
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 8);
      
      return res.json({
        success: true,
        data: { products: topProducts }
      });
    }

    const products = await Product.find({})
      .sort({ averageRating: -1, numReviews: -1 })
      .limit(8);

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get top rated products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch top rated products'
    });
  }
};
