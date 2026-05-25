/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProgress, ParentSettings, WorldId, Difficulty } from './types';
import { sfx } from './components/AudioEngine';
import WorldMap, { WORLDS_LIST } from './components/WorldMap';
import PuzzlePlayer from './components/PuzzlePlayer';
import Shop from './components/Shop';
import DailyRewards from './components/DailyRewards';
import SettingsPanel from './components/SettingsPanel';
import ParentPortal from './components/ParentPortal';
import { Sparkles, Trophy, Settings, ShoppingBag, Gift, User, Star, Coins, ArrowRight, ShieldCheck, Gamepad2, Info } from 'lucide-react';

const LOCAL_STORAGE_PROGRESS_KEY = 'smart_puzzle_city_progress_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'smart_puzzle_city_settings_v2';

const DEFAULT_PROGRESS: UserProgress = {
  selectedAvatar: '🧒',
  playerName: '',
  selectedSkinId: 'skin_default',
  selectedPetId: 'pet_none',
  coins: 50, // Starting bonus
  stars: 0,
  claimedDailyRewards: [],
  levelProgress: {
    [WorldId.Math]: 1,
    [WorldId.Memory]: 1,
    [WorldId.Colors]: 1,
    [WorldId.Words]: 1,
    [WorldId.Mazes]: 1,
    [WorldId.Secret]: 1,
    [WorldId.Logic]: 1,
    [WorldId.Hidden]: 1,
  },
  solvedLevelsHistory: {},
  unlockedSkins: ['skin_default'],
  unlockedPets: ['pet_none'],
  hintsLeft: 3,
  achievements: []
};

const DEFAULT_SETTINGS: ParentSettings = {
  musicOn: false,
  sfxOn: true,
  difficulty: Difficulty.Easy,
  restrictPlayTime: false,
  playTimeMinutes: 30
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [settings, setSettings] = useState<ParentSettings>(DEFAULT_SETTINGS);
  const [activeScreen, setActiveScreen] = useState<'loading' | 'onboarding' | 'map' | 'puzzle' | 'shop' | 'rewards' | 'settings' | 'parent-portal'>('loading');
  const [activeWorldId, setActiveWorldId] = useState<WorldId | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const savedProg = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      const savedSett = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      
      if (savedProg) {
        setProgress(JSON.parse(savedProg));
      }
      if (savedSett) {
        const parsedSett = JSON.parse(savedSett);
        setSettings(parsedSett);
        sfx.setMute(!parsedSett.sfxOn);
      }
    } catch (e) {
      console.error('Error loading game state:', e);
    }

    // Short loading timer for playful kids transition
    const loadingTimer = setTimeout(() => {
      setActiveScreen('loading'); // Stay on splash to trigger click
    }, 100);
    return () => clearTimeout(loadingTimer);
  }, []);

  // Save to local storage on changes
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  };

  const saveSettings = (newSettings: ParentSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  };

  // User click action to cleanly start AudioContext to overcome autoplay policy
  const handleStartGame = () => {
    sfx.playTap();
    if (settings.musicOn) {
      sfx.startBackgroundMusic();
    }
    
    // Route to onboarding if player has no name registered
    if (!progress.playerName) {
      setActiveScreen('onboarding');
    } else {
      setActiveScreen('map');
    }
  };

  // Onboarding registration
  const [onboardName, setOnboardName] = useState('');
  const [onboardPet, setOnboardPet] = useState('pet_none');

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim()) return;

    sfx.playLevelUp();
    const updatedProg = {
      ...progress,
      playerName: onboardName.trim(),
      selectedPetId: onboardPet,
      unlockedPets: onboardPet !== 'pet_none' ? [...progress.unlockedPets, onboardPet] : progress.unlockedPets
    };
    saveProgress(updatedProg);
    setActiveScreen('map');
  };

  // Solver success callback
  const handlePuzzleVictory = (starsEarned: number, coinsEarned: number) => {
    if (!activeWorldId) return;

    const currentLevelNum = progress.levelProgress[activeWorldId] || 1;
    
    // Accumulate metrics
    const updatedLevelProgress = { ...progress.levelProgress };
    updatedLevelProgress[activeWorldId] = currentLevelNum + 1;

    const updatedHistory = { ...progress.solvedLevelsHistory };
    updatedHistory[`${activeWorldId}_${currentLevelNum}`] = {
      starsEarned,
      attempts: 1
    };

    const nextProgress = {
      ...progress,
      coins: progress.coins + coinsEarned,
      stars: progress.stars + starsEarned,
      levelProgress: updatedLevelProgress,
      solvedLevelsHistory: updatedHistory
    };

    saveProgress(nextProgress);
    setActiveScreen('map');
    setActiveWorldId(null);
  };

  // Triggering visual layouts
  const currentAvatar = progress.selectedSkinId === 'skin_explorer' ? '👨‍🚀' :
                        progress.selectedSkinId === 'skin_magician' ? '🧙‍♂️' :
                        progress.selectedSkinId === 'skin_ninja' ? '🥷' :
                        progress.selectedSkinId === 'skin_detective' ? '🕵️‍♂️' :
                        progress.selectedSkinId === 'skin_superhero' ? '🦸‍♂️' : '🧒';

  const currentPetAvatar = progress.selectedPetId === 'pet_bird' ? '🐦' :
                        progress.selectedPetId === 'pet_cat' ? '🐱' :
                        progress.selectedPetId === 'pet_robot' ? '🤖' :
                        progress.selectedPetId === 'pet_unicorn' ? '🦄' :
                        progress.selectedPetId === 'pet_dragon' ? '🐉' : '';

  return (
    <div id="game-main-canvas" className="min-h-screen child-gradient-bg text-slate-800 font-sans flex flex-col justify-between p-4 selection:bg-amber-100 selection:text-amber-800 antialiased relative overflow-x-hidden">
      {/* Background Dots Overlay of the Bold Typography theme */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      <div className="relative z-10 flex-grow flex flex-col justify-between">

      {activeScreen === 'loading' && (
        <div id="splash-loading-screen" className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none animate-[pop-in_0.4s_ease-out]">
          
          <div className="relative mb-6">
            <span className="text-9xl block animate-kids-bounce">🎪</span>
            <span className="absolute -top-3 -right-3 text-5xl animate-pulse">✨</span>
            <span className="absolute -bottom-3 -left-3 text-5xl animate-pulse delay-150">🎨</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] tracking-tight mb-4 font-display">
            مدينة الألغاز الذكية
          </h1>
          <p className="text-blue-950 font-black text-xs sm:text-sm max-w-sm mb-8 leading-relaxed bg-white/45 backdrop-blur-md border border-white/50 px-5 py-3 rounded-[1.75rem] shadow-sm">
            مرحباً بك في مدينة الأسرار والذكاء! تجول في العوالم الثمانية اللطيفة وحل ألغاز المغامرات لتصبح بطلاً خارقاً!
          </p>

          <button
            id="start-adventure-btn"
            onClick={handleStartGame}
            className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-[2rem] border-b-8 border-orange-700 text-lg sm:text-2xl transition-all shadow-xl active:translate-y-1 active:border-b-4 duration-150"
          >
            ابدأ المغامرة الآن! 🎮
          </button>
        </div>
      )}

      {/* 2. ONBOARDING CHARACTER SETUP */}
      {activeScreen === 'onboarding' && (
        <div id="onboarding-setup-block" className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-md border-[6px] border-white rounded-[2.5rem] p-6 w-full max-w-md text-right shadow-2xl">
            <h2 className="text-3xl font-black text-blue-950 mb-2 flex items-center justify-end gap-2">
              <span>تسجيل مستكشف جديد</span>
              <Gamepad2 className="text-amber-500 animate-pulse" size={28} />
            </h2>
            <p className="text-xs font-bold text-slate-700 mb-6 bg-slate-100/60 p-2 rounded-2xl border border-slate-200/50">اكتب اسمك الرائع واختر رفيقك السحري الأول لتنضم لمدينة الألغاز!</p>

            <form onSubmit={handleCompleteOnboarding} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-blue-950 block">اكتب اسمك يا بطل (الأقل من 14 حرفاً):</label>
                <input
                  id="onboard-player-name-input"
                  type="text"
                  required
                  maxLength={14}
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  placeholder="مثال: يوسف البطل..."
                  className="w-full px-4 py-3 border-[3px] border-orange-200 rounded-2xl text-right text-sm font-black focus:outline-none focus:border-orange-500 focus:bg-white placeholder:text-slate-350 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-blue-950 block">اختر رفيقك الصغير المرافق مجاناً:</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'pet_none', label: 'بدون رفيق', icon: '🧑‍🚀' },
                    { id: 'pet_bird', label: 'العصفور زقزوق', icon: '🐦' },
                    { id: 'pet_cat', label: 'مشمش القط', icon: '🐱' },
                    { id: 'pet_robot', label: 'زيزو الروبوت', icon: '🤖' }
                  ].map((pOpt) => {
                    const isSelected = onboardPet === pOpt.id;
                    return (
                      <button
                        id={`onboard-pet-${pOpt.id}`}
                        key={pOpt.id}
                        type="button"
                        onClick={() => {
                          sfx.playTap();
                          setOnboardPet(pOpt.id);
                        }}
                        className={`p-3 rounded-2.5xl border-3 text-center flex flex-col items-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-55'
                            : 'border-slate-100 bg-slate-100/40 hover:bg-slate-150'
                        }`}
                      >
                        <span className="text-4xl mb-1 filter drop-shadow">{pOpt.icon}</span>
                        <span className="text-xs font-black text-slate-800">{pOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="submit-onboarding-btn"
                type="submit"
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-[1.75rem] border-b-8 border-green-700 text-lg transition-all active:translate-y-1 active:border-b-4 shadow-xl"
              >
                انطلق لحل الألغاز! 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. MAIN APP GAME SHELL VIEW (Map, shop, puzzle boards) */}
      {activeScreen !== 'loading' && activeScreen !== 'onboarding' && (
        <div id="game-active-play-space" className="flex-1 max-w-3xl mx-auto w-full flex flex-col gap-6 select-none">
          
          {/* TOP PLAYER INFORMATION HUD BAR (Glassmorphic & Cartoon 3D) */}
          <div className="bg-white/30 backdrop-blur-md px-5 py-4 rounded-[2rem] border-4 border-white/50 flex justify-between items-center select-none shadow-xl gap-4 flex-wrap sm:flex-nowrap">
            
            {/* Left side actions (Daily rewards, customize, options/settings) */}
            <div className="flex gap-3">
              <button
                id="hud-settings-btn"
                onClick={() => {
                  sfx.playTap();
                  setActiveScreen('settings');
                }}
                title="إعدادات وصوت"
                className="w-12 h-12 bg-pink-500 hover:bg-pink-600 border-b-6 border-pink-700 text-white rounded-2xl flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 shadow-lg cursor-pointer"
              >
                <Settings size={22} className="stroke-[2.5]" />
              </button>

              <button
                id="hud-shop-btn"
                onClick={() => {
                  sfx.playTap();
                  setActiveScreen('shop');
                }}
                title="متجر الأذكياء"
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 border-b-6 border-blue-700 text-white rounded-2xl flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag size={22} className="stroke-[2.5]" />
              </button>

              <button
                id="hud-rewards-btn"
                onClick={() => {
                  sfx.playTap();
                  setActiveScreen('rewards');
                }}
                title="عجلة الجوائز"
                className="w-12 h-12 bg-yellow-400 hover:bg-yellow-500 border-b-6 border-yellow-600 text-white rounded-2xl flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 shadow-lg cursor-pointer relative"
              >
                <Gift size={22} className="stroke-[2.5]" />
                {/* Notification dot */}
                <span className="absolute -top-1 -left-1 w-4.5 h-4.5 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
              </button>
            </div>

            {/* Middle Coin, Star status badges */}
            <div className="flex items-center gap-3">
              <div className="bg-white/95 border-[3px] border-yellow-500 rounded-full px-4 py-1.5 flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-105 select-none">
                <span className="text-yellow-600 font-extrabold text-xs sm:text-sm">⭐ {progress.stars}</span>
              </div>
              <div className="bg-white/95 border-[3px] border-amber-500 rounded-full px-4 py-1.5 flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-105 select-none">
                <span className="text-amber-600 font-extrabold text-xs sm:text-sm">💰 {progress.coins}</span>
              </div>
            </div>

            {/* Right side Profile details */}
            <button
              id="hud-profile-btn"
              onClick={() => {
                sfx.playTap();
                setActiveScreen('parent-portal'); // Parent Portal or CharacterCustomizer
              }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 border-[3px] border-blue-500 text-right cursor-pointer transition-all hover:scale-103 shadow-md"
            >
              <div className="text-right leading-tight pr-1">
                <span className="text-sm font-black text-blue-900 block">{progress.playerName || 'بطلنا'}</span>
                <span className="text-[10px] text-blue-500 font-black">غرفة التخصيص 🎨</span>
              </div>
              <div className="relative">
                <span className="text-4xl filter drop-shadow select-none">{currentAvatar}</span>
                {currentPetAvatar && (
                  <span className="absolute -bottom-1 -left-1.5 text-xs bg-white text-orange-500 border-2 border-orange-200 w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {currentPetAvatar}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* ACTIVE SCREEN ROUTER FRAMEWORK */}
          <div className="flex-1">
            
            {/* 3A. WORLD PROGRESSION MAP LAYOUT */}
            {activeScreen === 'map' && (
              <WorldMap
                progress={progress}
                onSelectWorld={(worldId) => {
                  setActiveWorldId(worldId);
                  setActiveScreen('puzzle');
                }}
              />
            )}

            {/* 3B. PUZZLE CHALLENGE SOLVER GAME BOARD */}
            {activeScreen === 'puzzle' && activeWorldId && (
              <PuzzlePlayer
                worldId={activeWorldId}
                levelNumber={progress.levelProgress[activeWorldId] || 1}
                hintsCount={progress.hintsLeft}
                onUseHint={() => {
                  saveProgress({
                    ...progress,
                    hintsLeft: Math.max(0, progress.hintsLeft - 1)
                  });
                }}
                onPuzzleSuccess={(starsEarned, coinsEarned) => {
                  handlePuzzleVictory(starsEarned, coinsEarned);
                }}
                onBackToMap={() => {
                  sfx.playTap();
                  setActiveScreen('map');
                  setActiveWorldId(null);
                }}
              />
            )}

            {/* 3C. THE CHILDREN SHOP */}
            {activeScreen === 'shop' && (
              <Shop
                progress={progress}
                onUpdateProgress={(uProg) => saveProgress(uProg)}
                onClose={() => {
                  sfx.playTap();
                  setActiveScreen('map');
                }}
              />
            )}

            {/* 3D. DAILY MYSTERY REWARDS */}
            {activeScreen === 'rewards' && (
              <DailyRewards
                progress={progress}
                onUpdateProgress={(uProg) => saveProgress(uProg)}
                onClose={() => {
                  sfx.playTap();
                  setActiveScreen('map');
                }}
              />
            )}

            {/* 3E. CONTROLLER CONFIG SETTINGS PANEL */}
            {activeScreen === 'settings' && (
              <SettingsPanel
                settings={settings}
                onUpdateSettings={(uSett) => saveSettings(uSett)}
                onOpenParentPortal={() => {
                  setActiveScreen('parent-portal');
                }}
                onClose={() => {
                  sfx.playTap();
                  setActiveScreen('map');
                }}
              />
            )}

            {/* 3F. DETAILED PARENT MONITORING PORTAL */}
            {activeScreen === 'parent-portal' && (
              <ParentPortal
                progress={progress}
                settings={settings}
                onUpdateSettings={(uSett) => saveSettings(uSett)}
                onClose={() => {
                  sfx.playTap();
                  setActiveScreen('map');
                }}
              />
            )}

          </div>
        </div>
      )}

      {/* FOOTER - ATTRACTIVE LOGO CREDIT (Glassmorphic) */}
      <footer className="text-center py-3.5 px-6 mt-8 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 text-blue-950 text-xs font-black shadow-md flex items-center justify-center gap-2">
        <span>© ٢٠٢٦ مدينة الألغاز الذكية - رحلة الإبداع والتطور الذكي 🌟</span>
      </footer>
      </div>

    </div>
  );
}
