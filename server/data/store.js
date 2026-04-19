// In-memory data store for "no database" execution
import { randomUUID } from 'crypto'; 

const adminId = 'user-admin-123';

const twoDaysFromNow = new Date();
twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

const oneDayAgo = new Date();
oneDayAgo.setDate(oneDayAgo.getDate() - 1);

export const store = {
  users: [
    {
      _id: adminId,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', // In a real app this is hashed, but we'll store plaintext for this mock or compare bcrypt
    }
  ],
  items: [
    {
      _id: 'item-1',
      title: 'Vintage Leather Jacket',
      description: 'Authentic 1980s leather jacket in excellent condition.',
      category: 'Clothing',
      imageUrl: 'https://picsum.photos/seed/jacket/500/500',
      startingPrice: 5000,
      currentBid: 5000,
      endTime: twoDaysFromNow.toISOString(),
      createdBy: adminId,
    },
    {
      _id: 'item-2',
      title: 'Apple iPhone 14 Pro',
      description: 'Brand new in box, never opened.',
      category: 'Smartphone',
      imageUrl: 'https://picsum.photos/seed/phone/500/500',
      startingPrice: 50000,
      currentBid: 50000,
      endTime: twoDaysFromNow.toISOString(),
      createdBy: adminId,
    },
    {
      _id: 'item-3',
      title: 'Ancient Chinese Vase',
      description: 'Ming dynasty replica vase, stunning details.',
      category: 'Vase',
      imageUrl: 'https://picsum.photos/seed/vase/500/500',
      startingPrice: 15000,
      currentBid: 15000,
      endTime: twoDaysFromNow.toISOString(),
      createdBy: adminId,
    },
    {
      _id: 'item-4',
      title: 'Signed Babe Ruth Baseball',
      description: 'Auction has ended. A legendary piece of history.',
      category: 'Baseball',
      imageUrl: 'https://picsum.photos/seed/baseball/500/500',
      startingPrice: 200000,
      currentBid: 250000,
      endTime: oneDayAgo.toISOString(),
      createdBy: adminId,
    }
  ],
  bids: []
};

// Utils for store
export const generateId = () => Math.random().toString(36).substring(2, 15);
