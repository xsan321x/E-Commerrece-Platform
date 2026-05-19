import cloudinary from '../config/cloudinary.js';

// Upload single image to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file ? 'Present' : 'Missing');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary using buffer directly
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nova-ecommerce/products',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          } else {
            console.log('Upload successful:', result.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
    });
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleImages = async (req, res) => {
  try {
    console.log('Multiple upload request received');
    console.log('Files:', req.files ? req.files.length : 0);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    console.log('Uploading', req.files.length, 'files to Cloudinary...');

    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'nova-ecommerce/products',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error(`File ${index + 1} upload error:`, error);
              reject(error);
            } else {
              console.log(`File ${index + 1} uploaded:`, result.secure_url);
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    const urls = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    console.log('All uploads successful');

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: urls },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
    });
  }
};

// Delete image from Cloudinary
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image',
    });
  }
};
