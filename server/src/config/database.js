import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Server will continue with DEMO MODE (mock data)');
    console.log('⚠️  To fix: Whitelist your IP in MongoDB Atlas');
    console.log('⚠️  Go to: https://cloud.mongodb.com → Network Access → Add IP');
    // Don't exit, let server continue with mock data
    return null;
  }
};

export default connectDB;
