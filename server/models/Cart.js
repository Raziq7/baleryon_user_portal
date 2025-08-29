import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }, // This should be an ObjectId
      size: { type: String, required: true },  // Add size field
      color: { type: String, required: true }, // Add color field
      quantity: { type: Number, default: 1 },
    }],
  });
  
  export const Cart = mongoose.model('Cart', cartSchema);
  