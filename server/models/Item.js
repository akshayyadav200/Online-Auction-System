import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  currentBid: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
