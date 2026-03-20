import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plane, Compass, Sparkles, Coffee, DollarSign, Calendar } from 'lucide-react';

const TravelPanel = ({ country, onGenerate, onClose, isGenerating }) => {
  const [budget, setBudget] = useState(2000);
  const [duration, setDuration] = useState(7);
  const [mood, setMood] = useState('Adventure');

  const moods = [
    { name: 'Adventure', icon: <Compass size={18} /> },
    { name: 'Chill', icon: <Coffee size={18} /> },
    { name: 'Luxury', icon: <Sparkles size={18} /> },
    { name: 'Budget', icon: <DollarSign size={18} /> }
  ];

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
              max="30" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
            />
            <span>{duration} Days</span>
          </div>
        </div>

        <div className="input-group">
          <label><DollarSign size={18} /> Budget (USD)</label>
          <div className="budget-input">
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)} 
            />
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
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="generate-btn" 
          onClick={() => onGenerate({ budget, duration, mood })}
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
