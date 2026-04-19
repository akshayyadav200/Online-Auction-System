import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddItem from './pages/AddItem';

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar onSearch={setSearchTerm} onCategoryChange={setCategory} />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home searchTerm={searchTerm} category={category} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
