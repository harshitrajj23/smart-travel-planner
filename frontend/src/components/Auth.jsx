import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Globe as GlobeIcon, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onAuthSuccess(data.user);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (signUpError) throw signUpError;
        
        if (data.user) {
          setSuccess(true);
          // Auto login after 2 seconds if confirm email is not required or just show success
          setTimeout(() => {
            if (!data.session) {
               setIsLogin(true);
               setSuccess(false);
            } else {
               onAuthSuccess(data.user);
            }
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="auth-header">
          <div className="auth-logo">
            <GlobeIcon className="logo-icon" size={32} />
            <span>SmartTravel</span>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Join the Adventure'}</h2>
          <p>{isLogin ? 'Log in to access your saved journeys' : 'Create an account to start planning'}</p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              className="auth-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <CheckCircle2 size={64} className="success-icon" />
              <h3>Account Created!</h3>
              <p>Check your email for confirmation or log in now.</p>
            </motion.div>
          ) : (
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              onSubmit={handleAuth}
              className="auth-form"
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {!isLogin && (
                <div className="auth-input-group">
                  <label><User size={18} /> Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required 
                  />
                </div>
              )}

              <div className="auth-input-group">
                <label><Mail size={18} /> Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="auth-input-group">
                <label><Lock size={18} /> Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button 
                type="submit" 
                className="auth-btn" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="auth-toggle">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
};

export default Auth;
