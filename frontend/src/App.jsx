import React, { useState } from 'react';
import Globe from './components/Globe';
import TravelPanel from './components/TravelPanel';
import Results from './components/Results';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [plannerData, setPlannerData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5001/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: selectedCountry,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      setPlannerData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate travel plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      {/* Hero Section */}
      {!selectedCountry && !plannerData && (
        <section className="hero">
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Plan Your Perfect Journey with AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover personalized travel experiences powered by advanced intelligence.
            </motion.p>
            <motion.button 
              className="cta-btn"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(79, 156, 249, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('globe-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Start Exploring
            </motion.button>
          </div>
        </section>
      )}

      {/* Globe Section */}
      <section id="globe-section" className={`globe-section ${selectedCountry ? 'shifted' : ''}`}>
        <Globe onSelectCountry={handleCountrySelect} />
      </section>

      {/* Slide-in Panel */}
      <AnimatePresence>
        {selectedCountry && !plannerData && (
          <TravelPanel 
            country={selectedCountry} 
            onGenerate={handleGenerate} 
            onClose={() => setSelectedCountry(null)}
            isGenerating={isGenerating}
          />
        )}
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {plannerData && (
          <Results data={plannerData} onReset={() => {
            setPlannerData(null);
            setSelectedCountry(null);
          }} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
