import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Moon, Sun, Palette, MousePointer, Snowflake, Check, Save } from 'lucide-react';

interface SettingsProps {
    settings: AppSettings;
    onSave: (newSettings: AppSettings) => void;
    onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave, onLogout }) => {
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [customThemeName, setCustomThemeName] = useState('');

    const handleChange = (key: keyof AppSettings, value: any) => {
        const updated = { ...localSettings, [key]: value };
        setLocalSettings(updated);
        onSave(updated); // Apply immediately
    };

    const handleColorChange = (key: 'background' | 'text' | 'primary', value: string) => {
        const updated = { 
            ...localSettings, 
            theme: 'custom',
            customColors: { ...localSettings.customColors, [key]: value } 
        };
        setLocalSettings(updated);
        onSave(updated);
    };

    return (
        <div className="flex-1 h-full overflow-y-auto p-8 pb-32">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-tech font-bold text-white mb-8">Settings</h1>

                {/* Appearance Section */}
                <section className="mb-10 animate-[fadeIn_0.3s_ease-out]">
                    <h2 className="text-xl font-bold text-frost-cyan mb-4 flex items-center gap-2">
                        <Palette size={20} /> Appearance
                    </h2>
                    
                    <div className="glass-panel p-6 rounded-2xl space-y-6">
                        {/* Themes */}
                        <div>
                            <label className="text-sm font-bold text-gray-400 uppercase mb-3 block">Theme Presets</label>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleChange('theme', 'dark')}
                                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${localSettings.theme === 'dark' ? 'bg-frost-cyan/20 border-frost-cyan text-white' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
                                >
                                    <Moon size={24} />
                                    <span className="font-bold">Dark</span>
                                </button>
                                <button 
                                    onClick={() => handleChange('theme', 'light')}
                                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${localSettings.theme === 'light' ? 'bg-white text-black border-white' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
                                >
                                    <Sun size={24} />
                                    <span className="font-bold">Light</span>
                                </button>
                                <button 
                                    onClick={() => handleChange('theme', 'custom')}
                                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${localSettings.theme === 'custom' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
                                >
                                    <Palette size={24} />
                                    <span className="font-bold">Custom</span>
                                </button>
                            </div>
                        </div>

                        {/* Custom Colors */}
                        {localSettings.theme === 'custom' && (
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 animate-[fadeIn_0.3s_ease-out]">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-bold text-gray-400 uppercase">Save Theme As</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="My Cool Theme" 
                                            value={customThemeName}
                                            onChange={(e) => setCustomThemeName(e.target.value)}
                                            className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-frost-cyan outline-none"
                                        />
                                        <button className="p-1.5 bg-green-600 rounded hover:bg-green-500 text-white">
                                            <Save size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Background</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="color" 
                                                value={localSettings.customColors.background}
                                                onChange={(e) => handleColorChange('background', e.target.value)}
                                                className="h-10 w-10 rounded cursor-pointer bg-transparent"
                                            />
                                            <input 
                                                type="text" 
                                                value={localSettings.customColors.background}
                                                onChange={(e) => handleColorChange('background', e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded px-2 text-sm text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Text Color</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="color" 
                                                value={localSettings.customColors.text}
                                                onChange={(e) => handleColorChange('text', e.target.value)}
                                                className="h-10 w-10 rounded cursor-pointer bg-transparent"
                                            />
                                            <input 
                                                type="text" 
                                                value={localSettings.customColors.text}
                                                onChange={(e) => handleColorChange('text', e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded px-2 text-sm text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Primary/Button</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="color" 
                                                value={localSettings.customColors.primary}
                                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                                className="h-10 w-10 rounded cursor-pointer bg-transparent"
                                            />
                                            <input 
                                                type="text" 
                                                value={localSettings.customColors.primary}
                                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded px-2 text-sm text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* UX / Effects Section */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-frost-cyan mb-4 flex items-center gap-2">
                        <MousePointer size={20} /> Experience
                    </h2>
                    
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        {/* Snow Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                    <Snowflake size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Snow Animation</div>
                                    <div className="text-xs text-gray-500">Enable ambient snowfall effect</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleChange('enableSnow', !localSettings.enableSnow)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.enableSnow ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localSettings.enableSnow ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Cursor Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                                    <MousePointer size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Custom Cursor</div>
                                    <div className="text-xs text-gray-500">Use the stylized Frost cursor</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleChange('customCursor', !localSettings.customCursor)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.customCursor ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localSettings.customCursor ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                <div className="border-t border-white/10 pt-8">
                    <button 
                        onClick={onLogout}
                        className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-black rounded-xl font-bold transition-all w-full"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};