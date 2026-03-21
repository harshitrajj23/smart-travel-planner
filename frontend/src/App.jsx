import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from './components/Globe';
import TravelPanel from './components/TravelPanel';
import Results from './components/Results';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [plannerData, setPlannerData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplored, setIsExplored] = useState(false);

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
        const errText = await response.text();
        console.error('Backend Error:', response.status, errText);
        throw new Error(`Failed to generate plan: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received Data:', data);
      setPlannerData(data);
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      alert(`Failed to generate travel plan. ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      {/* Hero Section */}
      <AnimatePresence>
        {!isExplored && !selectedCountry && !plannerData && (
          <motion.section 
            className="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="hero-content">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Plan Your Perfect <br /> Journey with AI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Experience the world like never before. Our AI crafts personalized itineraries based on your mood, budget, and dreams.
              </motion.p>
              <motion.button 
                className="cta-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => setIsExplored(true)}
              >
                Start Exploring
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Globe Section - Always present but interactive only after explored/during selection */}
      <section 
        id="globe-section" 
        className={`globe-section ${selectedCountry ? 'shifted' : ''}`}
        style={{ pointerEvents: (isExplored || selectedCountry) ? 'auto' : 'none' }}
      >
        <Globe onSelectCountry={handleCountrySelect} />
        {isExplored && !selectedCountry && !plannerData && (
          <motion.div 
            className="globe-instruction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Click a country to start your journey
          </motion.div>
        )}
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
