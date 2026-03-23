import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ExploreView from './views/ExploreView';
import Login from './views/Login';
import SignUp from './views/SignUp';
import DashboardView from './views/DashboardView';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Compass, PlusSquare, User, LogOut, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CustomCursor from './components/CustomCursor';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored).user);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('user-access-token');
    setUser(null);
    navigate('/');
  };

  if (['/login', '/SignUp', '/dashboard'].includes(location.pathname)) return null;

  return (
    <nav className="premium-nav">
      <div className="nav-blur" />
      <div className="nav-content">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <Sparkles className="brand-icon" size={20} />
          <span>Project<span>Hub</span></span>
        </div>

        <div className="nav-links">
          <button 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <Compass size={18} /> <span>Explore</span>
          </button>
          <button 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => user ? navigate('/dashboard') : navigate('/login')}
          >
            <LayoutGrid size={18} /> <span>Portfolio</span>
          </button>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-pill">
              <span className="username">{user.username}</span>
              <button className="logout-icon" onClick={handleLogout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <button className="btn-ghost" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-solid" onClick={() => navigate('/SignUp')}>Join</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-root">
        <CustomCursor />
        {/* Background Atmosphere */}
        <div className="glow-spot" style={{ top: '-10%', left: '-10%', opacity: 0.4 }} />
        <div className="glow-spot" style={{ bottom: '10%', right: '-10%', opacity: 0.3 }} />
        
        <Toaster richColors position="top-right" theme="dark" />
        <Navigation />
        
        <main className="main-viewport">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path='/' element={<ExploreView/>} />
              <Route path='/SignUp' element={<SignUp />} />
              <Route path='/login' element={<Login />} />
              <Route path='/dashboard' element={<DashboardView />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App
