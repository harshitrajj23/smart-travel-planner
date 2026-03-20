import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, CreditCard, ChevronLeft, ExternalLink } from 'lucide-react';

const Results = ({ data, onReset }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <motion.div 
      className="results-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="results-header">
        <button className="back-btn" onClick={onReset}>
          <ChevronLeft size={20} /> Change Destination
        </button>
        <h1>Your {data.destination} Adventure</h1>
      </div>

      <motion.div 
        className="results-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Section 1: Overview */}
        <motion.section variants={item} className="overview-card glass-panel">
          <div className="dest-image" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80)` }}>
            <div className="image-overlay">
              <span className="badge">{data.mood?.toUpperCase()} Trip</span>
            </div>
          </div>
          <div className="overview-content">
            <h3>AI Trip Summary</h3>
            <p>Your {data.days}-day {data.mood} journey to {data.destination} is ready. We've optimized every detail based on your preferences and budget.</p>
          </div>
        </motion.section>

        {/* Section 2: Itinerary */}
        <motion.section variants={item} className="itinerary-section">
          <h2><Calendar size={24} /> Daily Itinerary</h2>
          <div className="itinerary-list">
            {data.itinerary?.map((item, idx) => (
              <div key={idx} className="day-card glass-panel">
                <div className="day-number">Day {item.day}</div>
                <div className="day-info">
                  <h4>Daily Activities</h4>
                  <ul>
                    {item.activities?.map((act, i) => (
                      <li key={i} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Budget & Tips */}
        <div className="side-sections">
          <motion.section variants={item} className="budget-section glass-panel">
            <h2><CreditCard size={24} /> AI Estimate</h2>
            <div className="budget-items">
              <div className="budget-row total">
                <span>Estimated Total</span>
                <span className="amount">{data.estimatedCost}</span>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="tips-section glass-panel" style={{ marginTop: '2rem', padding: '2.5rem' }}>
            <h2><Sparkles size={24} /> Travel Tips</h2>
            <ul style={{ listStyle: 'none', color: 'var(--text-dim)' }}>
              {data.travelTips?.map((tip, i) => (
                <li key={i} style={{ marginBottom: '1rem', borderLeft: '2px solid var(--accent)', paddingLeft: '1rem' }}>{tip}</li>
              ))}
            </ul>
          </motion.section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Results;
