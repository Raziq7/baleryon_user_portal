import mongoose from 'mongoose';
import sanitizedConfig from '../config.js';

async function connect() {
  // Only the URI is needed; options are omitted in Mongoose v6+
  try {
    const db = await mongoose.connect(sanitizedConfig.MONGO_URI);
    return db;
  } catch (error) {
    // Optionally log or handle error
    throw error;
  }
}

export default connect;
