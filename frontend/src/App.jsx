import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Globe as GlobeIcon, Loader2 } from 'lucide-react';
import Globe from './components/Globe';
import TravelPanel from './components/TravelPanel';
import Results from './components/Results';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [plannerData, setPlannerData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplored, setIsExplored] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) setShowAuth(true);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        setShowAuth(false);
      } else {
        setShowAuth(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPlannerData(null);
    setSelectedCountry(null);
    setIsExplored(false);
  };

  const handleGenerate = async (formData) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5001/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: selectedCountry,
          ...formData,
          userId: user.id // Pass user ID to backend if needed for saving
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

  if (loading) {
    return (
      <div className="auth-overlay">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <div className="animate-spin" style={{ color: 'var(--accent)' }}>
            <Loader2 size={48} />
          </div>
          <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Initializing Adventure...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AnimatePresence>
        {showAuth && !user && (
          <Auth onAuthSuccess={(user) => {
            setUser(user);
            setShowAuth(false);
          }} />
        )}
      </AnimatePresence>

      {user && (
        <motion.div 
          className="user-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="user-badge">
            <UserIcon size={18} />
            <span>{user.user_metadata?.full_name || user.email.split('@')[0]}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Log Out">
            <LogOut size={20} />
          </button>
        </motion.div>
      )}

      {/* Hero Section */}
      <AnimatePresence>
        {!isExplored && !selectedCountry && !plannerData && user && (
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

      {/* Globe Section */}
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
