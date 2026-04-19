import { store, generateId } from '../data/store.js';
import { io } from '../server.js';

// @desc    Place a new bid
// @route   POST /api/bids/:itemId
// @access  Private
export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const itemId = req.params.itemId;

    const item = store.items.find(i => i._id === itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if auction has ended
    if (new Date(item.endTime) < new Date()) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if bid is higher than current bid
    if (amount <= item.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    const bid = {
      _id: generateId(),
      item: itemId,
      user: req.user._id,
      amount,
      createdAt: new Date().toISOString()
    };

    store.bids.push(bid);

    // Update item's current bid
    item.currentBid = amount;

    // Populate user info before emitting
    const userObj = store.users.find(u => u._id === req.user._id);
    const populatedBid = { ...bid, user: { _id: userObj._id, name: userObj.name } };

    // Emit socket event for real-time update
    io.to(itemId).emit('newBid', populatedBid);

    res.status(201).json(populatedBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bids for an item
// @route   GET /api/bids/:itemId
// @access  Public
export const getItemBids = async (req, res) => {
  try {
    const bids = store.bids
      .filter(b => b.item === req.params.itemId)
      .map(b => {
          const u = store.users.find(user => user._id === b.user);
          return { ...b, user: u ? { _id: u._id, name: u.name } : null };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
