import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-accent/10 pointer-events-none" />
      
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-3xl shadow-soft border border-border/50 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">DecisionLens</h1>
          <p className="text-sm text-secondary">
            Causal recourse intelligence for fairer admissions and hiring decisions.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Institutional Email</label>
              <input 
                type="email" 
                placeholder="reviewer@university.edu" 
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button className="text-xs font-medium text-accent hover:text-indigo-700 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              onClick={() => onLogin()}
              className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-md mt-2"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-2 text-xs text-secondary uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <button 
              onClick={() => onLogin()}
              className="w-full py-2.5 bg-background border border-border text-primary rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center text-sm text-secondary">
          {isLogin ? "Don't have an institutional account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-accent hover:text-indigo-700 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
