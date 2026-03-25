import React, { useState } from 'react';

interface AuthProps {
  onComplete: () => void;
}

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    realName: '',
    alias: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd do validation and API calls here.
    // We'll pass the names to onboarding.
    localStorage.setItem('temp_user', JSON.stringify(formData));
    onComplete();
  };

  return (
    <div className="auth-screen" style={{ padding: '40px 24px' }}>
      <div className="auth-hero" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '64px' }}>🐝</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '32px' }}>HabitTribe</h1>
        <p style={{ color: 'var(--t2)' }}>Grow habits. Bloom together.</p>
      </div>

      <div className="auth-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button 
          className={`btn ${!isSignUp ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setIsSignUp(false)}
        >Sign In</button>
        <button 
          className={`btn ${isSignUp ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setIsSignUp(true)}
        >Sign Up</button>
      </div>

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <input 
              className="inp" 
              placeholder="Real Name (App focus)" 
              value={formData.realName}
              onChange={e => setFormData({...formData, realName: e.target.value})}
              required
            />
            <input 
              className="inp" 
              placeholder="Alias (Tribe view)" 
              value={formData.alias}
              onChange={e => setFormData({...formData, alias: e.target.value})}
              required
            />
          </>
        )}
        <input 
          className="inp" 
          type="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
        <input 
          className="inp" 
          type="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          required
        />
        <button className="btn btn-primary" type="submit">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
