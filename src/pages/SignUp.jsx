import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkVeil from '../components/DardVeil';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    console.log('Sign up submitted', { email, password });
    
    // Show success message and redirect to login
    alert('Account created successfully! Please login.');
    navigate('/login');
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <h1 className="heading-xl" style={{ color: '#ffffff' }}>
            Create Account
          </h1>
          <p className="text-body" style={{ color: '#94a3b8' }}>
            Join ExpenseTracker and start managing your finances
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

        {/* Email Input */}
        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <label className="text-small" style={{
            display: 'block',
            color: '#e2e8f0',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            Email Address <span style={{ color: '#3b82f6' }}>*</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            style={{
              width: '100%',
              padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white'
            }}
            onKeyPress={(e) => e.key === 'Enter' && password && confirmPassword && handleSubmit()}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            style={{
              width: '100%',
              padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white'
            }}
            onKeyPress={(e) => e.key === 'Enter' && email && confirmPassword && handleSubmit()}
          />
          <p style={{
            fontSize: 'clamp(0.75rem, 1.8vw, 0.8rem)',
            color: '#64748b',
            marginTop: '0.5rem'
          }}>
            Must be at least 6 characters
          </p>
        </div>

        {/* Confirm Password Input */}
        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <label className="text-small" style={{
            display: 'block',
            color: '#e2e8f0',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            Confirm Password <span style={{ color: '#3b82f6' }}>*</span>
          </label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            style={{
              width: '100%',
              padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white'
            }}
            onKeyPress={(e) => e.key === 'Enter' && email && password && handleSubmit()}
          />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSubmit}
          disabled={!email || !password || !confirmPassword}
          style={{
            width: '100%',
            padding: 'clamp(0.875rem, 2.5vw, 1rem)',
            background: email && password && confirmPassword
              ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' 
              : 'rgba(59, 130, 246, 0.3)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            fontWeight: '600',
            cursor: email && password && confirmPassword ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            opacity: email && password && confirmPassword ? 1 : 0.5
          }}
        >
          Sign Up
        </button>

        {/* Already Have Account */}
        <p className="text-small" style={{
          textAlign: 'center',
          marginTop: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#94a3b8'
        }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sign In
          </span>
        </p>

        {/* Terms */}
        <p className="text-small" style={{
          textAlign: 'center',
          marginTop: 'clamp(1rem, 3vw, 1.5rem)',
          color: '#64748b',
          lineHeight: '1.5',
          fontSize: 'clamp(0.75rem, 1.8vw, 0.8rem)'
        }}>
          By signing up, you agree to our{' '}
          <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;