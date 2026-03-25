import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { motion } from 'framer-motion';

const Garden: React.FC = () => {
  const { habits } = useHabits();

  return (
    <div className="garden-screen" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>My Nursery 🌿</h2>
      <p style={{ color: 'var(--t2)', marginBottom: '24px' }}>Your habits bloom as you stay consistent.</p>

      <div className="garden-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px' 
      }}>
        {habits.map((h, i) => (
          <motion.div 
            key={h.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card" 
            style={{ 
              padding: '12px', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              border: h.health < 40 ? '1px solid rgba(255, 107, 138, 0.3)' : '1px solid var(--border)',
              filter: h.health < 40 ? 'saturate(0.5)' : 'none'
            }}
          >
            <motion.div 
              animate={{ 
                y: [0, -5, 0],
                scale: h.health > 70 ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ fontSize: '40px', marginBottom: '8px' }}
            >
              {h.health < 40 ? '🥀' : h.flower}
            </motion.div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
              {h.name}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--t3)', marginTop: '4px' }}>
              {h.health}% health
            </div>
            <div style={{ width: '100%', height: '3px', background: 'var(--bg3)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${h.health}%`, 
                height: '100%', 
                background: h.health > 70 ? '#3ECF8E' : h.health > 40 ? '#F5A623' : '#FF6B8A',
                transition: 'width 1s ease-out'
              }} />
            </div>
          </motion.div>
        ))}
        {habits.length === 0 && (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--t3)' }}>
            No flowers yet. Plant a habit to start your garden!
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, #1A1020, #120E1A)' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>💡 Pro Tip</h4>
        <p style={{ fontSize: '12px', color: 'var(--t2)', margin: 0 }}>
          Missing a day affects your flower's health. Stay consistent to see them bloom with special animations!
        </p>
      </div>
    </div>
  );
};

export default Garden;
