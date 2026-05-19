import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.model.js';
import Product from '../src/models/Product.model.js';
import Order from '../src/models/Order.model.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@luxe.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://res.cloudinary.com/ddqkerghb/image/upload/v1/avatars/admin.jpg',
    address: {
      street: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      pinCode: '10001'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://res.cloudinary.com/ddqkerghb/image/upload/v1/avatars/user1.jpg',
    address: {
      street: '456 User Lane',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      pinCode: '90001'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://res.cloudinary.com/ddqkerghb/image/upload/v1/avatars/user2.jpg',
    address: {
      street: '789 Customer Blvd',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      pinCode: '60601'
    }
  },
  {
    name: 'Michael Johnson',
    email: 'michael@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=12',
    address: {
      street: '321 Market Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      pinCode: '94102'
    }
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=45',
    address: {
      street: '654 Oak Avenue',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      pinCode: '98101'
    }
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=33',
    address: {
      street: '987 Pine Road',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      pinCode: '02101'
    }
  },
  {
    name: 'Sarah Martinez',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=47',
    address: {
      street: '147 Elm Street',
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      pinCode: '33101'
    }
  },
  {
    name: 'Robert Brown',
    email: 'robert@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=52',
    address: {
      street: '258 Maple Drive',
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      pinCode: '80201'
    }
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=38',
    address: {
      street: '369 Cedar Lane',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      pinCode: '73301'
    }
  },
  {
    name: 'James Taylor',
    email: 'james@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=15',
    address: {
      street: '741 Birch Court',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      pinCode: '97201'
    }
  }
];

const products = [
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  },
  {
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
    ratings: []
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log('👥 Users created');

    // Create products
    const createdProducts = await Product.create(products);
    console.log('📦 Products created');

    // Add some reviews to products
    const adminUser = createdUsers[0];
    const regularUser = createdUsers[1];

    // Add reviews to products from different users
    const reviewComments = [
      'Excellent product! Highly recommended.',
      'Great quality, very satisfied with my purchase.',
      'Amazing! Exceeded my expectations.',
      'Good value for money. Would buy again.',
      'Perfect! Exactly what I was looking for.',
      'Outstanding quality and fast shipping.',
      'Love it! Best purchase I made this year.',
      'Fantastic product, works perfectly.',
      'Very happy with this purchase!',
      'Superb quality and great design.'
    ];

    // Add reviews to all products
    for (let i = 0; i < createdProducts.length; i++) {
      const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 reviews per product
      for (let j = 0; j < numReviews && j < createdUsers.length; j++) {
        createdProducts[i].ratings.push({
          user: createdUsers[j]._id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)]
        });
      }
      await createdProducts[i].save();
    }
    console.log('⭐ Reviews added');

    // Create sample orders with variety
    const sampleOrders = [
      {
        user: regularUser._id,
        products: [
          {
            product: createdProducts[0]._id,
            quantity: 1,
            price: createdProducts[0].price
          },
          {
            product: createdProducts[2]._id,
            quantity: 1,
            price: createdProducts[2].price
          }
        ],
        totalAmount: createdProducts[0].price + createdProducts[2].price,
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        shippingAddress: regularUser.address,
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: createdUsers[2]._id,
        products: [
          {
            product: createdProducts[1]._id,
            quantity: 2,
            price: createdProducts[1].price
          }
        ],
        totalAmount: createdProducts[1].price * 2,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        shippingAddress: createdUsers[2].address
      },
      {
        user: createdUsers[3]._id,
        products: [
          {
            product: createdProducts[4]._id,
            quantity: 1,
            price: createdProducts[4].price
          },
          {
            product: createdProducts[5]._id,
            quantity: 1,
            price: createdProducts[5].price
          }
        ],
        totalAmount: createdProducts[4].price + createdProducts[5].price,
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        shippingAddress: createdUsers[3].address,
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        user: createdUsers[4]._id,
        products: [
          {
            product: createdProducts[6]._id,
            quantity: 3,
            price: createdProducts[6].price
          }
        ],
        totalAmount: createdProducts[6].price * 3,
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        shippingAddress: createdUsers[4].address,
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        user: createdUsers[5]._id,
        products: [
          {
            product: createdProducts[8]._id,
            quantity: 2,
            price: createdProducts[8].price
          },
          {
            product: createdProducts[9]._id,
            quantity: 1,
            price: createdProducts[9].price
          }
        ],
        totalAmount: createdProducts[8].price * 2 + createdProducts[9].price,
        paymentStatus: 'paid',
        orderStatus: 'processing',
        shippingAddress: createdUsers[5].address,
        paidAt: new Date()
      }
    ];

    await Order.create(sampleOrders);
    console.log('📋 Orders created');

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN:');
    console.log('   Email: admin@luxe.com');
    console.log('   Password: admin123');
    console.log('\n👥 USERS:');
    console.log('   Email: john@example.com | Password: password123');
    console.log('   Email: jane@example.com | Password: password123');
    console.log('   Email: michael@example.com | Password: password123');
    console.log('   Email: emily@example.com | Password: password123');
    console.log('   Email: david@example.com | Password: password123');
    console.log('   Email: sarah@example.com | Password: password123');
    console.log('   Email: robert@example.com | Password: password123');
    console.log('   Email: lisa@example.com | Password: password123');
    console.log('   Email: james@example.com | Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Summary:`);
    console.log(`   • ${createdUsers.length} users created`);
    console.log(`   • ${createdProducts.length} products created`);
    console.log(`   • Multiple reviews added`);
    console.log(`   • 5 sample orders created`);
    console.log('\n🚀 Ready to go! Start your server and frontend.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
