import { useNavigate } from 'react-router-dom';
import DarkVeil from '../components/DardVeil';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
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

      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
        textAlign: 'center'
      }}>
        {/* App Name */}
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 'clamp(1rem, 3vw, 2rem)',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          letterSpacing: '-0.02em'
        }}>
          ExpenseTracker
        </h1>

        {/* Quote */}
        <p style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '800px',
          marginBottom: 'clamp(2rem, 5vw, 3rem)',
          lineHeight: '1.6',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          fontWeight: '300'
        }}>
          Take control of your finances. Track every expense, understand your spending, and build a better financial future.
        </p>

        {/* Get Started Button */}
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(2.5rem, 5vw, 4rem)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
            fontWeight: '600',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingPage;