import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = ['Clothing', 'Painting', 'Watch', 'Smartphone', 'Vase', 'Baseball'];

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    startingPrice: '',
    endTime: '' // Format: YYYY-MM-DDTHH:mm
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    if (imageFiles.length === 0) {
      setError('Please select at least one image file to upload.');
      return;
    }
    
    if (imageFiles.length > 5) {
      setError('You can only upload a maximum of 5 images.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const uploadData = new FormData();
      imageFiles.forEach(file => {
        uploadData.append('images', file);
      });
      
      // Upload images first
      const uploadRes = await axios.post('http://localhost:5001/api/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Combine with backend host if it's a relative path
      const uploadedImageUrls = uploadRes.data.map(path => `http://localhost:5001${path}`);

      // Create Item
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      await axios.post('http://localhost:5001/api/items', {
        ...formData,
        imageUrls: uploadedImageUrls,
        startingPrice: Number(formData.startingPrice)
      }, config);
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding item');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 dark:text-white">Create New Auction</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              type="text" 
              className="input-field" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="input-field min-h-[100px]" 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="input-field"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image Upload (Max 5)</label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-blue-400"
                required
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-500 mt-1">Hold Shift or Ctrl/Cmd to select multiple.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Starting Price (₹)</label>
              <input 
                type="number" 
                className="input-field" 
                required
                min="0"
                value={formData.startingPrice}
                onChange={e => setFormData({...formData, startingPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Auction End Time</label>
              <input 
                type="datetime-local" 
                className="input-field" 
                required
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button type="button" disabled={uploading} onClick={() => navigate('/')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" disabled={uploading} className="btn-primary flex-1 disabled:opacity-50">
              {uploading ? 'Starting...' : 'Start Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
