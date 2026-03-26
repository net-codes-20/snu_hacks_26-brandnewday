import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { ARCHETYPES } from '../../constants/archetypes';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { completeOnboarding } = useHabits();
  const [step, setStep] = useState(0); // 0: Name/Alias, 1: Age/Gender, 2: Quiz
  const [quizStep, setQuizStep] = useState(0);
  const [data, setData] = useState({
    realName: '',
    alias: '',
    age: '',
    gender: '',
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const getQuizQuestions = (age: number) => {
    const isYouth = age < 22;
    const isSenior = age > 55;

    return [
      {
        id: 1,
        question: isYouth 
          ? "When you miss a study session or habit, how do you feel?" 
          : isSenior 
            ? "When you break your daily wellness routine, how do you feel?"
            : "When you miss a work-related or personal habit, how do you feel?",
        options: [
          { label: "It's a major setback, I hate breaking the chain.", value: "guardian" },
          { label: "I don't mind, I'll just start over tomorrow.", value: "optimist" },
          { label: "I analyze why I failed so I can fix my system.", value: "architect" },
          { label: "I feel like I've lost a battle.", value: "warrior" }
        ]
      },
      {
        id: 2,
        question: isYouth
          ? "What motivates your growth most?"
          : "What motivates your daily consistency most?",
        options: [
          { label: "Seeing the big end-goal and vision.", value: "visionary" },
          { label: "Showing up for my friends and tribe.", value: "caregiver" },
          { label: "Mastering a skill and seeing the metrics.", value: "warrior" },
          { label: "The beauty and quality of my work.", value: "artisan" }
        ]
      },
      {
        id: 3,
        question: "How do you prefer your progress timeline?",
        options: [
          { label: "Steady, slow, and reliable pace.", value: "anchor" },
          { label: "Short, high-intensity bursts.", value: "spark" },
          { label: "Deep, mindful sessions regardless of time.", value: "sage" },
          { label: "Constantly changing and trying new things.", value: "explorer" }
        ]
      },
      {
        id: 4,
        question: isYouth
          ? "What's your primary academic or life goal?"
          : "What's your primary life or career goal?",
        options: [
          { label: "Radical transformation of my current path.", value: "alchemist" },
          { label: "Exploring new horizons and experiences.", value: "explorer" },
          { label: "Building a rock-solid foundation for my life.", value: "anchor" },
          { label: "Deep spiritual or intellectual growth.", value: "sage" }
        ]
      },
      {
        id: 5,
        question: isYouth
          ? "How does your school/study routine look?"
          : "How does your professional/daily routine look?",
        options: [
          { label: "Highly detailed and systematic.", value: "architect" },
          { label: "Strict and disciplined.", value: "warrior" },
          { label: "Creative and focused on quality.", value: "artisan" },
          { label: "Flexible and focused on the 'vibe'.", value: "optimist" }
        ]
      }
    ];
  };

  const currentQuestions = getQuizQuestions(parseInt(data.age) || 25);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      if (quizStep < currentQuestions.length - 1) {
        setQuizStep(quizStep + 1);
      } else {
        finishOnboarding();
      }
    }
  };

  const finishOnboarding = () => {
    const counts: Record<string, number> = {};
    Object.values(quizAnswers).forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
    });
    
    let winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'optimist');
    const archetype = ARCHETYPES[winner];

    completeOnboarding({
      realName: data.realName,
      alias: data.alias,
      age: parseInt(data.age),
      gender: data.gender,
      personalityType: archetype.name,
      personalityIcon: archetype.icon,
      archetype: archetype
    });
    
    onComplete();
  };

  return (
    <div className="onboarding-screen" style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
      <div className="progress-bar" style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div 
            key={i} 
            style={{ 
              flex: 1, 
              height: '4px', 
              background: (step === 0 && i === 0) || (step === 1 && i <= 1) || (step === 2 && i <= quizStep + 2) ? 'var(--amber)' : 'var(--bg3)', 
              borderRadius: '2px' 
            }} 
          />
        ))}
      </div>

      {step === 0 && (
        <div className="ob-slide">
          <h2 style={{ fontSize: '28px', marginBottom: '8px', fontFamily: 'var(--font-head)' }}>Let's get <span>started</span></h2>
          <p style={{ color: 'var(--t2)', marginBottom: '24px' }}>How should we address you?</p>
          
          <label className="label" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px', color: 'var(--t3)' }}>REAL NAME</label>
          <input 
            className="inp" 
            placeholder="e.g. John Doe" 
            value={data.realName} 
            onChange={e => setData({...data, realName: e.target.value})} 
          />
          
          <label className="label" style={{ display: 'block', marginBottom: '8px', marginTop: '16px', fontWeight: 'bold', fontSize: '12px', color: 'var(--t3)' }}>TRIBE ALIAS (Nickname)</label>
          <input 
            className="inp" 
            placeholder="e.g. NightOwl" 
            value={data.alias} 
            onChange={e => setData({...data, alias: e.target.value})} 
          />
          
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '40px' }}
            disabled={!data.realName || !data.alias}
            onClick={handleNext}
          >
            Next Step →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="ob-slide">
          <h2 style={{ fontSize: '28px', marginBottom: '8px', fontFamily: 'var(--font-head)' }}>A bit <span>more</span> info</h2>
          <p style={{ color: 'var(--t2)', marginBottom: '24px' }}>To personalize your HabiTribe experience.</p>
          
          <label className="label" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px', color: 'var(--t3)' }}>AGE</label>
          <input 
            className="inp" 
            type="number" 
            placeholder="Enter age" 
            value={data.age} 
            onChange={e => setData({...data, age: e.target.value})} 
          />
          
          <label className="label" style={{ display: 'block', marginBottom: '8px', marginTop: '16px', fontWeight: 'bold', fontSize: '12px', color: 'var(--t3)' }}>GENDER</label>
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
          
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '40px' }}
            disabled={!data.age || !data.gender}
            onClick={handleNext}
          >
            Start Personalized Quiz →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="ob-slide">
          <p style={{ color: 'var(--amber)', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
            QUESTION {quizStep + 1} OF 5
          </p>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', fontFamily: 'var(--font-head)' }}>
            {currentQuestions[quizStep].question}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestions[quizStep].options.map((opt, idx) => (
              <button 
                key={idx} 
                className={`btn ${quizAnswers[quizStep] === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textAlign: 'left', padding: '16px' }}
                onClick={() => setQuizAnswers({...quizAnswers, [quizStep]: opt.value})}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '40px' }}
            disabled={!quizAnswers[quizStep]}
            onClick={handleNext}
          >
            {quizStep === 4 ? 'Discover My Archetype 🌱' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
