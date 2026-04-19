import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

const Home = ({ searchTerm, category }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/items');
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items", error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:5001');

    // Automatically join all item rooms so we can receive updates for them
    items.forEach(item => socket.emit('joinItem', item._id));

    socket.on('newBid', (updatedBidInfo) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item._id === updatedBidInfo.item) {
            return { ...item, currentBid: updatedBidInfo.amount };
          }
          return item;
        })
      );
    });

    return () => socket.disconnect();
  }, [items.length]);

  const placeBid = async (itemId, amount) => {
    if (!user) {
      alert("Please login to place a bid.");
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.post(`http://localhost:5001/api/bids/${itemId}`, { amount }, config);
      // Let socket update the UI automatically
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing bid');
    }
  };

  const handleDelete = async (itemId) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this auction?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`http://localhost:5001/api/items/${itemId}`, config);
        setItems(items.filter(item => item._id !== itemId));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting item');
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="text-center py-20">Loading auctions...</div>;

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="mb-16 text-center max-w-3xl mx-auto px-4 mt-8">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold tracking-wide backdrop-blur-md">
          Live Real-time Bidding Engine
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight text-white drop-shadow-2xl">
          Discover. Bid. <span className="text-gradient">Win it!</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed font-light">
          Experience the thrill of instantaneous auctions with a vibrant community. Find exclusive items, place your bids, and secure the ultimate prize before the clock runs out.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to={user ? "/add-item" : "/register"} className="btn-primary py-3 px-8 text-lg hover:px-10 transition-all">
            {user ? "Create Auction" : "Start Bidding"}
          </Link>
          <a href="#auctions" className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white font-medium text-lg hidden sm:block">
            Explore Items
          </a>
        </div>
      </section>

      {/* Main Grid */}
      <div id="auctions" className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <span className="w-3 h-8 bg-violet-500 rounded-full inline-block"></span>
            Active Auctions {category ? `- ${category}` : ''}
          </h2>
          <div className="text-sm font-medium px-4 py-2 bg-zinc-900/50 rounded-full border border-white/5 text-gray-400">
            {filteredItems.length} items ticking down
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-32 text-gray-400 bg-zinc-900/50 border border-white/5 rounded-3xl backdrop-blur-sm">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No auctions found</h3>
            <p className="max-w-sm mx-auto">We couldn't find anything matching your search criteria. Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item._id} item={item} onPlaceBid={placeBid} onDelete={handleDelete} currentUser={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
