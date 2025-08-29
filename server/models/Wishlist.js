import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    size: { type: String },   // Optional: in case user saves preference
    color: { type: String },  // Optional: same as above
    addedAt: { type: Date, default: Date.now },
  }],
});

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
