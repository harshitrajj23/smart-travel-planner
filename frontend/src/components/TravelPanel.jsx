import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plane, Compass, Sparkles, Coffee, DollarSign, Calendar } from 'lucide-react';

const TravelPanel = ({ country, onGenerate, onClose, isGenerating }) => {
  const [budget, setBudget] = useState(2000);
  const [duration, setDuration] = useState(7);
  const [mood, setMood] = useState('Adventure');

  const moods = [
    { name: 'chill', label: 'Chill', icon: <Coffee size={18} /> },
    { name: 'adventure', label: 'Adventure', icon: <Compass size={18} /> },
    { name: 'romantic', label: 'Romantic', icon: <Sparkles size={18} /> },
    { name: 'budget', label: 'Budget', icon: <DollarSign size={18} /> }
  ];

  const getBudgetLabel = (val) => {
    if (val < 1000) return 'low';
    if (val < 3000) return 'medium';
    return 'high';
  };

  return (
    <motion.div 
      className="travel-panel glass-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <div className="panel-header">
        <h2>{country}</h2>
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
      </div>

      <div className="panel-content">
        <div className="input-group">
          <label><Calendar size={18} /> Duration (Days)</label>
          <div className="days-control">
             <input 
              type="range" 
              min="1" 
              max="15" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
            />
            <span>{duration} Days</span>
          </div>
        </div>

        <div className="input-group">
          <label><DollarSign size={18} /> Budget: {getBudgetLabel(budget).toUpperCase()}</label>
          <div className="days-control">
            <input 
              type="range" 
              min="500" 
              max="5000" 
              step="500"
              value={budget} 
              onChange={(e) => setBudget(e.target.value)} 
            />
            <span>${budget}</span>
          </div>
        </div>

        <div className="input-group">
          <label>Travel Mood</label>
          <div className="mood-grid">
            {moods.map((m) => (
              <button 
                key={m.name}
                className={`mood-btn ${mood === m.name ? 'active' : ''}`}
                onClick={() => setMood(m.name)}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="generate-btn" 
          onClick={() => onGenerate({ budget: getBudgetLabel(budget), days: parseInt(duration), mood })}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles size={20} />
            </motion.div>
          ) : (
            <>
              Generate Plan <Plane size={20} />
            </>
          )}
        </button>
      </div>

    </motion.div>
  );
};

export default TravelPanel;
