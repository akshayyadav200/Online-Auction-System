import React, { useState, useEffect } from 'react';
import { Clock, Users, Trash2 } from 'lucide-react';

const ItemCard = ({ item, onPlaceBid, onDelete, currentUser }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(item.endTime) - new Date();
      if (difference <= 0) {
        setIsEnded(true);
        setTimeLeft('Auction Ended');
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }

      // Check delete window (5 mins)
      if (item.createdAt && currentUser && currentUser._id === item.createdBy?._id) {
        const itemCreated = new Date(item.createdAt);
        const fiveMinutesInMillis = 5 * 60 * 1000;
        setCanDelete((new Date() - itemCreated) <= fiveMinutesInMillis);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [item.endTime, item.createdAt, currentUser]);

  const handleBid = () => {
    if (Number(bidAmount) > item.currentBid && !isEnded) {
      onPlaceBid(item._id, Number(bidAmount));
      setBidAmount('');
    }
  };

  const calculateImageArray = () => {
    if (item.imageUrls && item.imageUrls.length > 0) return item.imageUrls;
    if (item.imageUrl) return [item.imageUrl]; // Backwards compatibility for seed data
    return ['https://via.placeholder.com/300?text=No+Image'];
  };

  const images = calculateImageArray();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="premium-card flex flex-col h-full relative group">
      {canDelete && (
        <button 
          onClick={() => onDelete(item._id)}
          className="absolute top-3 right-3 bg-red-500/80 backdrop-blur text-white p-2 text-sm rounded-full hover:bg-red-500 hover:scale-110 transition shadow-[0_0_15px_rgba(239,68,68,0.5)] z-20"
          title="Delete auction (within 5 mins)"
        >
          <Trash2 size={16} />
        </button>
      )}
      <div className="h-56 w-full overflow-hidden bg-black/40 relative">
        <img 
          src={images[currentImageIndex]} 
          alt={`${item.title} - view ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error'; }}
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              &#8592;
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              &#8594;
            </button>
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold truncate">{item.title}</h3>
          <span className="text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 dark:text-gray-400">
          <Clock size={16} className={isEnded ? "text-red-500" : "text-blue-500"}/>
          <span className={`font-medium ${isEnded ? 'text-red-500' : ''}`}>{timeLeft}</span>
        </div>

        <div className="mb-4 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg flex justify-between items-center border border-gray-100 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">Current Bid</span>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">₹{item.currentBid.toLocaleString()}</span>
        </div>

        {!isEnded ? (
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder={`> ₹${item.currentBid}`}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:outline-none focus:border-blue-500"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={item.currentBid + 1}
            />
            <button 
              onClick={handleBid}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition active:scale-95 whitespace-nowrap"
            >
              Place Bid
            </button>
          </div>
        ) : (
          <button disabled className="w-full bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 py-2 rounded-lg font-medium cursor-not-allowed">
            Auction Ended
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
