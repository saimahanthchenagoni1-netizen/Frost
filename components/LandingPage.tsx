import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface LandingPageProps {
  onLogin: (user: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const getStoredUsers = () => {
    try {
        const stored = localStorage.getItem('frost_users');
        const parsedStored = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(parsedStored)) return [];
        
        // Merge stored users with MOCK_USERS for fallback login (Default password for mocks: 'password')
        const mockUsersWithPass = Object.values(MOCK_USERS).map(u => ({ ...u, password: 'password' }));
        
        return [...parsedStored, ...mockUsersWithPass];
    } catch (e) {
        console.error("Error reading stored users:", e);
        // Fallback to just mocks if local storage is corrupt
        return Object.values(MOCK_USERS).map(u => ({ ...u, password: 'password' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
        const storedUsers = getStoredUsers();

        if (activeTab === 'register') {
            const lowerUser = formData.username.toLowerCase().trim();
            const defaultTaken = Object.values(MOCK_USERS).map(u => u.username.toLowerCase());
            
            // Check duplications (in local storage AND default mocks)
            const userExists = storedUsers.some((u: any) => u.username.toLowerCase() === lowerUser) || defaultTaken.includes(lowerUser);

            if (userExists) {
                setError("Username unavailable");
                setIsLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }

            if (formData.password.length < 4) {
                setError("Password too weak");
                setIsLoading(false);
                return;
            }

            // Create User
            const newUser = {
                id: `user-${Date.now()}`,
                username: formData.username,
                discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
                avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${formData.username}`,
                status: 'online',
                customStatus: 'New to Frost',
                memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                password: formData.password 
            };

            // Save to Persistent Storage only (don't save mocks back to storage)
            try {
                const currentStored = localStorage.getItem('frost_users');
                const parsedCurrent = currentStored ? JSON.parse(currentStored) : [];
                const updatedUsers = Array.isArray(parsedCurrent) ? [...parsedCurrent, newUser] : [newUser];
                localStorage.setItem('frost_users', JSON.stringify(updatedUsers));
            } catch (e) {
                console.error("Failed to save user", e);
            }
            
            setIsLoading(false);
            onLogin(newUser); // Log in immediately
            return;

        } else {
            // Login Logic
            const foundUser = storedUsers.find((u: any) => 
                u.username.toLowerCase() === formData.username.toLowerCase().trim() && 
                u.password === formData.password
            );

            if (!foundUser) {
                setError("Invalid username or password");
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            onLogin(foundUser);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
      <div className="absolute top-[-200px] left-[-200px] w-[800px] h-[800px] bg-frost-cyan/10 rounded-full blur-[150px] animate-float opacity-50" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] opacity-40" />

      <div className="flex flex-col items-center w-full max-w-sm px-4 z-10">
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-black font-tech tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-default">
          FROST
        </h1>
        <p className="text-frost-cyan/80 font-tech tracking-[0.2em] text-sm uppercase mb-10">Fast. Social. Unstoppable.</p>

        {/* Auth Card */}
        <div className="w-full glass-card p-1 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white/10">
            {/* Tabs */}
            <div className="flex p-1 bg-black/20 rounded-t-3xl">
                <button 
                    onClick={() => { setActiveTab('login'); setError(null); }}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'login' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => { setActiveTab('register'); setError(null); }}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'register' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Register
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-1 animate-[fadeIn_0.3s_ease-out]">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-2">Username</label>
                    <input 
                        type="text" 
                        name="username"
                        required
                        autoComplete="username"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-frost-cyan focus:shadow-neon outline-none transition-all placeholder-gray-600"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="space-y-1 relative">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-2">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            required
                            autoComplete={activeTab === 'register' ? "new-password" : "current-password"}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-frost-cyan focus:shadow-neon outline-none transition-all pr-10 placeholder-gray-600"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                 {activeTab === 'register' && (
                     <div className="space-y-1 animate-[fadeIn_0.3s_ease-out]">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-2">Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            required
                            autoComplete="new-password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-frost-cyan focus:shadow-neon outline-none transition-all placeholder-gray-600"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                 )}

                 {error && (
                     <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-pulse">
                         <AlertCircle size={16} />
                         {error}
                     </div>
                 )}

                 <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-frost-cyan to-blue-500 text-black font-bold text-lg rounded-xl hover:shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:scale-100"
                 >
                    {isLoading ? <Loader className="animate-spin" /> : (
                        <>
                            {activeTab === 'login' ? 'Enter Frost' : 'Create Account'} <ArrowRight size={20} />
                        </>
                    )}
                 </button>
            </form>
        </div>
      </div>
    </div>
  );
};