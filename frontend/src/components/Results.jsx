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
          <div className="dest-image" style={{ backgroundImage: `url(${data.places[0].image})` }}>
            <div className="image-overlay">
              <span className="badge">{data.mood} Trip</span>
            </div>
          </div>
          <div className="overview-content">
            <h3>AI Trip Summary</h3>
            <p>Experience the perfect blend of {data.mood.toLowerCase()} and culture in {data.destination}. This {data.duration}-day journey is curated to maximize your ${data.budget} budget while hitting every highlight.</p>
          </div>
        </motion.section>

        {/* Section 2: Itinerary */}
        <motion.section variants={item} className="itinerary-section">
          <h2><Calendar size={24} /> Daily Itinerary</h2>
          <div className="itinerary-list">
            {data.itinerary.map((day, idx) => (
              <div key={idx} className="day-card glass-panel">
                <div className="day-number">Day {day.day}</div>
                <div className="day-info">
                  <h4>{day.title}</h4>
                  <p>{day.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Budget breakdown */}
        <motion.section variants={item} className="budget-section glass-panel">
          <h2><CreditCard size={24} /> Estimated Breakdown</h2>
          <div className="budget-items">
            {data.budgetBreakdown.map((item, idx) => (
              <div key={idx} className="budget-row">
                <span>{item.category}</span>
                <span className="amount">{item.amount}</span>
              </div>
            ))}
            <div className="budget-row total">
              <span>Total Estimated</span>
              <span className="amount">${data.budget}</span>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Places to visit */}
        <motion.section variants={item} className="places-section">
          <h2><MapPin size={24} /> Must-Visit Spots</h2>
          <div className="places-grid">
            {data.places.map((place, idx) => (
              <motion.div 
                key={idx} 
                className="place-card glass-panel"
                whileHover={{ y: -10 }}
              >
                <img src={place.image} alt={place.name} />
                <div className="place-info">
                  <h4>{place.name}</h4>
                  <p>Top Rated Discovery</p>
                  <button className="visit-btn"><ExternalLink size={14} /> Details</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
};

export default Results;
