import { store, generateId } from '../data/store.js';

// @desc    Fetch all items
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const enrichedItems = store.items.map(item => {
        const creator = store.users.find(u => u._id === item.createdBy);
        return { ...item, createdBy: creator ? { _id: creator._id, name: creator.name } : null };
    });
    res.json(enrichedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single item
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = store.items.find(i => i._id === req.params.id);
    if (item) {
      const creator = store.users.find(u => u._id === item.createdBy);
      res.json({ ...item, createdBy: creator ? { _id: creator._id, name: creator.name } : null });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const { title, description, category, imageUrls, startingPrice, endTime } = req.body;

    const item = {
      _id: generateId(),
      title,
      description,
      category,
      imageUrls: imageUrls || [], // Handle array of photos
      startingPrice,
      currentBid: startingPrice,
      endTime,
      createdBy: req.user._id,
      createdAt: new Date().toISOString()
    };

    store.items.push(item);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an item (within 5 mins of creation)
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const itemIndex = store.items.findIndex(i => i._id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const item = store.items[itemIndex];

    // Check if the user is the creator
    if (item.createdBy !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // Check if within 5 minutes of creation
    const fiveMinutesInMillis = 5 * 60 * 1000;
    const itemDate = new Date(item.createdAt);
    if (new Date() - itemDate > fiveMinutesInMillis) {
      return res.status(400).json({ message: 'You can only delete an item within 5 minutes of creating it.' });
    }

    // Remove item and any associated bids
    store.items.splice(itemIndex, 1);
    store.bids = store.bids.filter(b => b.item !== req.params.id);

    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
