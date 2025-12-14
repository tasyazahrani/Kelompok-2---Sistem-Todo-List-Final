import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// ============================================================
// 1. SETUP UNTUK PELANGGAN LAMA (NATIVE MONGODB)
// ============================================================
const options = {};
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ============================================================
// 2. SETUP UNTUK PELANGGAN BARU (MONGOOSE)
// ============================================================
export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(uri);
    console.log("MongoDB (Mongoose) Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error ❌", error);
  }
};

// ============================================================
// 3. EXPORT KEDUANYA
// ============================================================
// Ini untuk file Login, Register, dll (Yang butuh default export)
export default clientPromise; 

// Ini untuk file Todo (Yang butuh named export)
// connectDB sudah di-export di atas pakai kata kunci 'export const'