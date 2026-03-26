import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';

// const QUOTES = [
//   "Rest is not a reward for the work you've done, but a necessary foundation for the work you'll do.",
//   "You cannot pour from an empty cup. Take care of yourself first.",
//   "Breath is the bridge which connects life to consciousness. Give yourself a moment.",
//   "Healing takes time, and asking for help is a courageous step.",
//   "Self-compassion is simply giving the same kindness to ourselves that we would give to others."
// ];

interface MeTimePopupProps {
  onClose: () => void;
}

const MeTimePopup: React.FC<MeTimePopupProps> = ({ onClose }) => {
  // const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [activity, setActivity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('me_time_shown', 'true');
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', background: 'linear-gradient(135deg, #1A1D26, #13151B)', border: '1px solid rgba(255,107,139,0.2)', textAlign: 'center', padding: '40px 24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <Heart size={48} color="#FF4B6E" style={{ margin: '0 auto 24px', animation: 'pulse 2s infinite' }} />



        {!submitted ? (
          <>
            <h3 style={{ marginBottom: '16px', color: '#FF4B6E' }}>Did you have your 'me time' today? 🌸</h3>
            <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '24px' }}>
              Even 5 minutes of doing something just for yourself matters. What did you do to unwind?
            </p>
            <textarea
              className="inp"
              placeholder="e.g., Read a book, took a walk, drank tea..."
              value={activity}
              onChange={e => setActivity(e.target.value)}
              style={{ minHeight: '80px', marginBottom: '16px' }}
            />
            <button
              className="btn btn-primary"
              style={{ width: '100%', background: 'linear-gradient(90deg, #FF4B6E, #FF9B8E)' }}
              onClick={handleSubmit}
              disabled={!activity.trim()}
            >
              Log Me Time
            </button>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--t3)', marginTop: '16px', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onClose}
            >
              Skip for now
            </button>
          </>
        ) : (
          <div>
            <h3 style={{ color: '#3ECF8E', marginBottom: '8px' }}>Wonderful! ✨</h3>
            <p style={{ color: 'var(--t2)', fontSize: '14px' }}>Thank you for taking care of yourself today.</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MeTimePopup;
