import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkVeil from '../components/DardVeil';
import { authAPI } from '../services/Api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(username, password);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (onLogin) {
        onLogin();
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    alert('Google Sign In is not implemented yet in backend');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(1rem, 3vw, 2rem)'
    }}>
      {/* DarkVeil Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <DarkVeil 
          hueShift={360}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          speed={0.3}
          scanlineFrequency={0.5}
          warpAmount={0.3}
          resolutionScale={1}
        />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <h1 className="heading-xl" style={{ color: '#ffffff' }}>
            ExpenseTracker
          </h1>
          <p className="text-body" style={{ color: '#94a3b8' }}>
            Sign in to manage your finances
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '0.875rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#ef4444',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <label className="text-small" style={{
            display: 'block',
            color: '#e2e8f0',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            Username <span style={{ color: '#3b82f6' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white',
              opacity: loading ? 0.6 : 1
            }}
            onKeyPress={(e) => e.key === 'Enter' && password && !loading && handleSubmit()}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label className="text-small" style={{
            display: 'block',
            color: '#e2e8f0',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            Password <span style={{ color: '#3b82f6' }}>*</span>
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white',
              opacity: loading ? 0.6 : 1
            }}
            onKeyPress={(e) => e.key === 'Enter' && username && !loading && handleSubmit()}
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <a href="#" className="text-small" style={{
            color: '#3b82f6',
            textDecoration: 'none'
          }}>
            Forgot Password?
          </a>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!username || !password || loading}
          style={{
            width: '100%',
            padding: 'clamp(0.875rem, 2.5vw, 1rem)',
            background: username && password && !loading
              ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' 
              : 'rgba(59, 130, 246, 0.3)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            fontWeight: '600',
            cursor: username && password && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            opacity: username && password && !loading ? 1 : 0.5
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.3)' }}></div>
          <span className="text-small" style={{ 
            padding: '0 1rem', 
            color: '#64748b',
            fontWeight: '500' 
          }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.3)' }}></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: 'clamp(0.75rem, 2vw, 0.875rem)',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s',
            color: '#e2e8f0',
            opacity: loading ? 0.6 : 1
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-small" style={{
          textAlign: 'center',
          marginTop: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#94a3b8'
        }}>
          Don't have an account?{' '}
          <span
            onClick={() => !loading && navigate('/signup')}
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            Create Account
          </span>
        </p>

        <p className="text-small" style={{
          textAlign: 'center',
          marginTop: 'clamp(1rem, 3vw, 1.5rem)',
          color: '#64748b',
          lineHeight: '1.5',
          fontSize: 'clamp(0.75rem, 1.8vw, 0.8rem)'
        }}>
          By signing in, you agree to our{' '}
          <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default Login;