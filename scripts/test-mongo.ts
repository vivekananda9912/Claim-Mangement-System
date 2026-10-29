import mongoose from 'mongoose';

const uri = 'mongodb+srv://vangetivivek_db_user:YIBmEW25m8xQqvXV@cluster0.mo7u0lh.mongodb.net/omniclaim?retryWrites=true&w=majority';

async function testConnection() {
  console.log('Connecting to MongoDB Atlas...');
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected successfully! Database name:', conn.connection.name);
    console.log('Collections:', await conn.connection.db?.listCollections().toArray());
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
  } catch (err: any) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();
