import React, { useRef } from 'react';
import { X, Share2 } from 'lucide-react';

interface ShareWrappedProps {
  onClose: () => void;
  type: 'personal' | 'tribe';
  data: {
    name: string;
    score: number;
    subtitle: string;
    details: string;
  };
}

const ShareWrapped: React.FC<ShareWrappedProps> = ({ onClose, type, data }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${type === 'personal' ? 'Habit' : 'Tribe'} Progress`,
          text: `Check out my progress: ${data.name} - ${data.score}${type === 'personal' ? '' : '%'} (${data.details})`,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      alert('Native sharing not supported on this browser. You can screenshot this card to share it on Instagram or WhatsApp!');
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '24px' }}>
      
      {/* The Story Card */}
      <div 
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: '360px',
          aspectRatio: '9/16',
          borderRadius: '24px',
          background: type === 'personal' 
            ? 'linear-gradient(135deg, #FF4B6E, #FF9B8E)' 
            : 'linear-gradient(135deg, #5BC4F5, #9B8EFF)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', fontSize: '150px', opacity: 0.2 }}>
          {type === 'personal' ? '🔥' : '🐝'}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8, marginBottom: '8px' }}>
            {type === 'personal' ? 'Daily Wrap' : 'Tribe Wrap'}
          </div>
          <h2 style={{ fontSize: '42px', lineHeight: 1.1, margin: '0 0 16px 0', fontFamily: 'var(--font-head)' }}>
            {data.name}
          </h2>
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '80px', fontWeight: 'bold', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            {data.score}{type === 'personal' ? '' : '%'}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '500', opacity: 0.9 }}>
            {data.subtitle}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '18px', opacity: 0.9, textAlign: 'center', marginBottom: '24px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '16px' }}>
            {data.details}
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.7 }}>
            brandnewday
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        <button 
          onClick={handleShare}
          style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '24px' }}
        >
          <Share2 size={24} />
        </button>
        <button 
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '16px', textAlign: 'center' }}>
        Screenshot this card, or tap the share button to send to Instagram/WhatsApp!
      </p>
    </div>
  );
};

export default ShareWrapped;
