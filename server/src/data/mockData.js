// Mock data for testing without MongoDB connection

export const mockProducts = [
  {
    _id: '1',
    title: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort padding.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
    ],
    price: 299.99,
    stock: 50,
    category: 'Electronics',
    brand: 'AudioPro',
    ratings: [
      {
        _id: 'r1',
        user: { _id: 'u1', name: 'John Doe', avatar: '' },
        rating: 5,
        comment: 'Excellent product! Highly recommended.',
        createdAt: new Date().toISOString()
      }
    ],
    averageRating: 5,
    numReviews: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Smart Watch Series X',
    description: 'Stay connected with our latest smartwatch. Track your fitness, receive notifications, and monitor your health with advanced sensors.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
    ],
    price: 399.99,
    stock: 30,
    category: 'Electronics',
    brand: 'TechWear',
    ratings: [],
    averageRating: 4.5,
    numReviews: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Designer Leather Jacket',
    description: 'Premium genuine leather jacket with modern design. Perfect for any occasion, combining style and comfort.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800'
    ],
    price: 249.99,
    stock: 25,
    category: 'Fashion',
    brand: 'UrbanStyle',
    ratings: [],
    averageRating: 4.8,
    numReviews: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Luxury Handbag',
    description: 'Elegant designer handbag crafted from premium materials. Spacious interior with multiple compartments.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800'
    ],
    price: 189.99,
    stock: 40,
    category: 'Fashion',
    brand: 'LuxeMode',
    ratings: [],
    averageRating: 4.6,
    numReviews: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    title: 'Modern Coffee Table',
    description: 'Sleek and modern coffee table with tempered glass top and solid wood base. Perfect centerpiece for your living room.',
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
    ],
    price: 349.99,
    stock: 15,
    category: 'Home & Living',
    brand: 'HomeElegance',
    ratings: [],
    averageRating: 4.7,
    numReviews: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    title: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'
    ],
    price: 279.99,
    stock: 20,
    category: 'Home & Living',
    brand: 'ComfortPro',
    ratings: [],
    averageRating: 4.9,
    numReviews: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '7',
    title: 'Organic Skincare Set',
    description: 'Complete organic skincare routine with cleanser, toner, serum, and moisturizer. All-natural ingredients.',
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800'
    ],
    price: 89.99,
    stock: 60,
    category: 'Beauty',
    brand: 'PureGlow',
    ratings: [],
    averageRating: 4.4,
    numReviews: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '8',
    title: 'Professional Makeup Kit',
    description: 'Complete professional makeup kit with 50+ shades. Includes eyeshadows, lipsticks, and brushes.',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'
    ],
    price: 129.99,
    stock: 35,
    category: 'Beauty',
    brand: 'GlamourPro',
    ratings: [],
    averageRating: 4.7,
    numReviews: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '9',
    title: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with non-slip surface. Eco-friendly materials, perfect for all yoga styles.',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800'
    ],
    price: 49.99,
    stock: 80,
    category: 'Sports',
    brand: 'FitLife',
    ratings: [],
    averageRating: 4.5,
    numReviews: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '10',
    title: 'Running Shoes Pro',
    description: 'Professional running shoes with advanced cushioning and breathable mesh. Perfect for marathon training.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'
    ],
    price: 159.99,
    stock: 45,
    category: 'Sports',
    brand: 'RunFast',
    ratings: [],
    averageRating: 4.8,
    numReviews: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '11',
    title: 'Bestseller Novel Collection',
    description: 'Collection of 5 bestselling novels from award-winning authors. Perfect for book lovers.',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
    ],
    price: 79.99,
    stock: 100,
    category: 'Books',
    brand: 'ReadMore',
    ratings: [],
    averageRating: 4.6,
    numReviews: 55,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '12',
    title: 'Educational STEM Kit',
    description: 'Complete STEM learning kit for kids. Includes robotics, coding, and science experiments.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
      'https://images.unsplash.com/photo-1560582861-45078880e48e?w=800'
    ],
    price: 119.99,
    stock: 55,
    category: 'Toys',
    brand: 'LearnPlay',
    ratings: [],
    averageRating: 4.9,
    numReviews: 38,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockUsers = [
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@nova.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=9333EA&color=fff',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
