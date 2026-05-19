import User from '../models/User.model.js';

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    res.json({
      success: true,
      data: { 
        wishlist: {
          products: user.wishlist || []
        }
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch wishlist'
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    await user.populate('wishlist');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlist: user.wishlist }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add to wishlist'
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );

    await user.save();
    await user.populate('wishlist');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: { wishlist: user.wishlist }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove from wishlist'
    });
  }
};
