import React, { useState } from 'react';
import './Auth.css';
import { authService } from '../../services/authService';

interface AuthProps {
  onComplete?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await authService.signUp(
          formData.email,
          formData.password,
          '', // realName moved to onboarding
          ''  // alias moved to onboarding
        );
        if (signUpError) throw signUpError;
        alert('Check your email for the confirmation link!');
      } else {
        const { error: signInError } = await authService.signIn(
          formData.email,
          formData.password
        );
        if (signInError) throw signInError;
      }
      
      if (onComplete) onComplete();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-hero">
          <span className="auth-logo" role="img" aria-label="bee">🐝</span>
          <h1>HabitTribe</h1>
          <p>Grow habits. Bloom together.</p>
        </div>

        <div className="auth-tabs">
          <button 
            type="button"
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`} 
            disabled={loading}
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`} 
            disabled={loading}
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{ color: '#FF6B6B', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            className="inp" 
            type="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            disabled={loading}
          />
          <input 
            className="inp" 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
            disabled={loading}
          />
          <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-footer">
          {isSignUp ? (
            <p>Already have an account? <span onClick={() => setIsSignUp(false)}>Sign In</span></p>
          ) : (
            <p>Don't have an account? <span onClick={() => setIsSignUp(true)}>Sign Up</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
