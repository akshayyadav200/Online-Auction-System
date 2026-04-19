import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, ChevronDown, User as UserIcon } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Clothing',
  'Painting',
  'Watch',
  'Smartphone',
  'Vase',
  'Baseball'
];

const Navbar = ({ onSearch, onCategoryChange }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(onSearch) onSearch(localSearch);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="glass-pill max-w-5xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Top bar */}
        <div className="flex w-full md:w-auto justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform tracking-tight">
            Bidify
          </Link>
          
          <div className="md:hidden flex gap-3">
            {!user ? (
              <Link to="/login" className="text-sm font-medium text-gray-300">Login</Link>
            ) : (
                <button onClick={handleLogout} className="text-sm font-medium text-red-400">Logout</button>
            )}
          </div>
        </div>

        {/* Search & Categories */}
        <div className="flex-1 w-full md:px-4 flex gap-0 h-11 items-center justify-center">
          <div className="flex w-full max-w-xl shadow-inner rounded-full bg-zinc-950/60 p-1 border border-white/5">
            <div className="relative group min-w-[130px]">
              <button 
                onClick={() => setShowCategories(!showCategories)}
                className="h-full w-full px-4 rounded-full flex items-center justify-between text-sm whitespace-nowrap hover:bg-white/5 transition text-gray-300"
              >
                Categories <ChevronDown size={14} className="ml-1 opacity-70" />
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 rounded-xl shadow-2xl border border-white/10 py-2 z-50 backdrop-blur-xl">
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => {
                          if(onCategoryChange) onCategoryChange(cat === 'All Categories' ? '' : cat);
                          setShowCategories(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-violet-600/20 transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-[1px] h-6 bg-white/10 my-auto"></div>
            
            <form onSubmit={handleSearchSubmit} className="flex-1 relative flex">
              <input 
                type="text" 
                placeholder="Search auctions..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full h-full px-4 bg-transparent focus:outline-none text-white placeholder-gray-500 text-sm"
              />
              <button type="submit" className="absolute right-2 inset-y-0 px-2 text-gray-400 hover:text-violet-400 transition-colors">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Auth / Action Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-gray-400 hover:text-violet-400 transition">Auctions</Link>
          {user ? (
            <>
              <Link to="/add-item" className="text-gray-400 hover:text-violet-400 transition whitespace-nowrap">Add Item</Link>
              <div className="flex items-center gap-4 border-l pl-4 border-white/10">
                <span className="flex items-center gap-2 text-violet-400">
                  <UserIcon size={16} /> {user.name}
                </span>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition">Logout</button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 border-l pl-4 border-white/10">
              <Link to="/login" className="text-gray-400 hover:text-violet-400 transition">Login</Link>
              <Link to="/register" className="btn-primary py-1.5 px-5">Join</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
