import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import type { User } from '@supabase/supabase-js';

const AuthExample: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [realName, setRealName] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    // 1. Initial user check
    authService.getUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // 2. Listen for auth changes (session management)
    const subscription = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await authService.signUp(email, password, realName, displayName);
    if (error) {
      alert(error.message);
    } else {
      alert(`Welcome, ${user?.user_metadata.displayName}! Please check your email for confirmation.`);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await authService.signIn(email, password);
    if (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await authService.signOut();
    if (error) alert(error.message);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4 border rounded shadow max-w-md mx-auto">
      {user ? (
        <div className="space-y-2">
          <p>Logged in as: <strong>{user.email}</strong></p>
          <p>Display Name: {user.user_metadata.displayName}</p>
          <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Sign Up / Login</h2>
          <form className="space-y-2 flex flex-col">
            <input 
              type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded"
            />
            <input 
              type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="border p-2 rounded"
            />
            <input 
              type="text" placeholder="Real Name" value={realName} onChange={e => setRealName(e.target.value)}
              className="border p-2 rounded"
            />
            <input 
              type="text" placeholder="Display Name (Alias)" value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="flex space-x-2">
              <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded flex-1">
                Login
              </button>
              <button onClick={handleSignUp} className="bg-green-500 text-white px-4 py-2 rounded flex-1">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthExample;
