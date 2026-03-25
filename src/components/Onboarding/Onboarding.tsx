import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { completeOnboarding } = useHabits();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    age: '',
    gender: '',
    motivation: '',
    description: '',
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Simulate AI analysis
      const analysis = analyzePersonality(data);
      const tempUser = JSON.parse(localStorage.getItem('temp_user') || '{}');
      
      const userData = {
        realName: tempUser.realName || 'User',
        alias: tempUser.alias || 'Alias',
        age: parseInt(data.age),
        gender: data.gender,
        personalityType: analysis.type,
        personalityIcon: analysis.icon
      };

      completeOnboarding(userData);
      onComplete();
    }
  };

  const analyzePersonality = (d: any) => {
    // Mock logic: if description has 'stress', it's 'Calm Seeker'
    if (d.description.toLowerCase().includes('stress') || d.description.toLowerCase().includes('relax')) {
      return { type: 'Calm Seeker', icon: '🧘' };
    }
    if (d.motivation === 'goals') {
      return { type: 'High Achiever', icon: '🔥' };
    }
    return { type: 'Green Thumb', icon: '🌱' };
  };

  return (
    <div className="onboarding-screen" style={{ padding: '24px' }}>
      <div className="progress-bar" style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--amber)' : 'var(--bg3)', borderRadius: '2px' }} />
        ))}
      </div>

      {step === 0 && (
        <div className="ob-slide">
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Tell us <span>about</span> you</h2>
          <p style={{ color: 'var(--t2)', marginBottom: '24px' }}>This helps us customize your journey.</p>
          
          <label className="label" style={{ display: 'block', marginBottom: '8px' }}>AGE</label>
          <input className="inp" type="number" placeholder="Enter age" value={data.age} onChange={e => setData({...data, age: e.target.value})} />
          
          <label className="label" style={{ display: 'block', marginBottom: '8px', marginTop: '16px' }}>GENDER</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Male', 'Female', 'Other'].map(g => (
              <button 
                key={g} 
                className={`btn ${data.gender === g ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setData({...data, gender: g})}
              >{g}</button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="ob-slide">
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>What <span>drives</span> you?</h2>
          <p style={{ color: 'var(--t2)', marginBottom: '24px' }}>Pick your primary motivation.</p>
          
          {['goals', 'community', 'peace'].map(m => (
            <button 
              key={m} 
              className={`btn ${data.motivation === m ? 'btn-primary' : 'btn-secondary'}`}
              style={{ marginBottom: '12px', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              onClick={() => setData({...data, motivation: m})}
            >
              <span>{m === 'goals' ? '🔥 High Achiever' : m === 'community' ? '🤝 Connector' : '🧘 Calm Seeker'}</span>
              {data.motivation === m && <span>✓</span>}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="ob-slide">
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Share your <span>vision</span></h2>
          <p style={{ color: 'var(--t2)', marginBottom: '24px' }}>Describe what you want to achieve in a few sentences.</p>
          <textarea 
            className="inp" 
            style={{ height: '120px', resize: 'none' }} 
            placeholder="e.g. I want to build a consistent meditation habit to handle work stress..."
            value={data.description}
            onChange={e => setData({...data, description: e.target.value})}
          />
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <button className="btn btn-primary" onClick={handleNext}>
          {step === 2 ? 'Analyze & Bloom 🌱' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
