import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PillNav from './components/PillNav';
import FloatingAIChat from './components/FloatingAIChat';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AddExpenses from './pages/AddExpenses';
import AiInsights from './pages/AiInsights';
import './App.css';
import logo from './assets/react.svg';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Show nav on all pages except landing, login, and signup
  const showNav = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';
  
  const navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Add Expenses', href: '/add_expenses' },
    { label: 'AI Insights', href: '/ai_insights' }
  ];

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <div className="app" style={{ 
      minHeight: '100vh',
      background: location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup'
        ? 'transparent'
        : 'linear-gradient(to bottom, #0f172a, #1e293b)'
    }}>
      {showNav && (
        <PillNav
          logo={logo}
          logoAlt="ExpenseTracker Logo"
          items={navItems}
          activeHref={location.pathname}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#3b82f6"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#ffffff"
        />
      )}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/add_expenses" element={<AddExpenses />} />
        <Route path="/ai_insights" element={<AiInsights />} />
      </Routes>

      {/* Floating AI Chat - Shows only on authenticated pages */}
      {showNav && <FloatingAIChat />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;