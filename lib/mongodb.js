import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongodb URI to .env.local')
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

async function connect() {
  try {
    if (!client) {
      client = new MongoClient(uri, options);
      console.log('Attempting to connect to MongoDB...');
      await client.connect();
      console.log('Successfully connected to MongoDB.');
    }
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connect();
}

export default clientPromise; 