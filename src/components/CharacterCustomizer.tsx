/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProgress, AchievementBadge } from '../types';
import { User, Sparkles, Award, ShieldAlert } from 'lucide-react';
import { sfx } from './AudioEngine';

interface CharacterCustomizerProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onClose: () => void;
}

// Full child achievement badges
export const BADGES_DB: AchievementBadge[] = [
  { id: 'first_puzzle', title: 'مستكشف مبتدئ 🧭', description: 'حل أول لغز بنجاح في مدينة الألغاز السعيدة!', icon: '🧭', conditionText: 'حل لغز واحد' },
  { id: 'has_coins_100', title: 'جامع النقود الذهبية 💰', description: 'جمعت أكثر من 100 قطعة نقدية من مخابر الأذكياء!', icon: '💰', conditionText: 'تجميع 100 عملة' },
  { id: 'math_wizard', title: 'عبقري الرياضيات 🧙‍♂️', description: 'أكلمت المستوى الثالث بنجاح في عالم الأرقام المذهل!', icon: '🧮', conditionText: 'المستوى 3 في الرياضيات' },
  { id: 'memory_master', title: 'حارس الذاكرة الحديدي 🧠', description: 'طابقت صور الكروت السحرية بنجاح فائق!', icon: '🧠', conditionText: 'المستوى 3 في الذاكرة' },
  { id: 'words_spellbinder', title: 'صانع الكلمات العجيب ✍️', description: 'رتبت حروف اللغة لتكوين أسماء الحيوانات بسرعة!', icon: '✍️', conditionText: 'المستوى 3 في الكلمات' },
  { id: 'has_pet', title: 'صديق الحيوانات والأرواح 🦄', description: 'حصلت على رفيقك السحري الأول من المتجر السعيد!', icon: '🦄', conditionText: 'اقتناء رفيق سحري' },
  { id: 'star_collector', title: 'حاصد النجوم والشهب ⭐', description: 'حصلت على أكثر من 15 نجمة استكشافية ذهبية!', icon: '⭐', conditionText: 'تجميع 15 نجمة' }
];

export default function CharacterCustomizer({
  progress,
  onUpdateProgress,
  onClose
}: CharacterCustomizerProps) {
  const [nameInput, setNameInput] = useState(progress.playerName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    sfx.playSuccess();
    onUpdateProgress({
      ...progress,
      playerName: nameInput.trim()
    });
  };

  // Find current avatars
  const currentSkinAvatar = progress.selectedSkinId === 'skin_explorer' ? '👨‍🚀' :
                        progress.selectedSkinId === 'skin_magician' ? '🧙‍♂️' :
                        progress.selectedSkinId === 'skin_ninja' ? '🥷' :
                        progress.selectedSkinId === 'skin_detective' ? '🕵️‍♂️' :
                        progress.selectedSkinId === 'skin_superhero' ? '🦸‍♂️' : '🧒';

  const currentPetAvatar = progress.selectedPetId === 'pet_bird' ? '🐦' :
                        progress.selectedPetId === 'pet_cat' ? '🐱' :
                        progress.selectedPetId === 'pet_robot' ? '🤖' :
                        progress.selectedPetId === 'pet_unicorn' ? '🦄' :
                        progress.selectedPetId === 'pet_dragon' ? '🐉' : '';

  // Calculate unlock state of badges
  const totalLevelsSolved = Object.values(progress.levelProgress).reduce((acc, curr) => acc + (curr - 1), 0);
  const mathLevel = progress.levelProgress['math'] || 1;
  const memoryLevel = progress.levelProgress['memory'] || 1;
  const wordsLevel = progress.levelProgress['words'] || 1;

  const isBadgeUnlocked = (badgeId: string) => {
    switch (badgeId) {
      case 'first_puzzle':
        return totalLevelsSolved >= 1;
      case 'has_coins_100':
        return progress.coins >= 100;
      case 'math_wizard':
        return mathLevel >= 3;
      case 'memory_master':
        return memoryLevel >= 3;
      case 'words_spellbinder':
        return wordsLevel >= 3;
      case 'has_pet':
        return progress.selectedPetId !== 'pet_none' && progress.selectedPetId !== '';
      case 'star_collector':
        return progress.stars >= 15;
      default:
        return false;
    }
  };

  return (
    <div id="character-modal-container" className="bg-white border-4 border-amber-400 soft-card-shadow rounded-3xl p-6 max-w-2xl mx-auto text-right animate-[pop-in_0.3s_ease]">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 mb-6">
        <button
          id="close-profile-btn"
          onClick={onClose}
          className="px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl text-xs transition-all animate-pulse"
        >
          خروج وحفظ ✕
        </button>
        <div className="flex items-center gap-1.5">
          <User className="text-amber-500" size={24} />
          <h3 className="text-xl font-black text-amber-700">غرفة تخصيص البطل الباسل</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Badge Shelf */}
        <div className="bg-slate-50 p-4 rounded-2.5xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-center text-slate-700 text-sm mb-4 flex items-center justify-center gap-1">
              <span>أوسمة الشرف الذهبية الخاصة بك</span>
              <Award size={18} className="text-amber-500" />
            </h4>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {BADGES_DB.map((badge) => {
                const unlocked = isBadgeUnlocked(badge.id);
                return (
                  <div
                    key={badge.id}
                    title={`${badge.title}: ${badge.description}`}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all border-2 select-none ${
                      unlocked
                        ? 'bg-amber-100/40 border-amber-300 animate-kids-bounce text-amber-900 cursor-help'
                        : 'bg-slate-200 border-slate-300 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow">{unlocked ? badge.icon : '🔒'}</span>
                    <span className="text-[8px] font-bold text-slate-600 truncate max-w-full text-center mt-1">
                      {badge.title.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-dashed border-slate-200 text-center">
            <span className="text-xs text-slate-500 block leading-tight">
              أكمل التحديات والتقط المستويات في الألغاز لفتح الأوسمة!
            </span>
          </div>
        </div>

        {/* Right column: Avatar edit & Preview */}
        <div className="space-y-6">
          {/* Avatar Preview block */}
          <div className="bg-gradient-to-tr from-amber-200 to-yellow-100 p-6 rounded-2.5xl border-3 border-amber-300 text-center relative overflow-hidden soft-card-shadow">
            {/* Background sunbeam effect */}
            <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl scale-120 pointer-events-none"></div>

            <div className="relative z-10 flex justify-center items-end gap-2 py-4">
              {/* Pet companion flying */}
              {currentPetAvatar && (
                <div className="text-4.5xl animate-bounce filter drop-shadow-md duration-1000">
                  {currentPetAvatar}
                </div>
              )}
              {/* Main character avatar */}
              <div className="text-6.5xl animate-kids-bounce filter drop-shadow">
                {currentSkinAvatar}
              </div>
            </div>

            <h4 className="font-black text-amber-900 text-lg relative z-10">
              {progress.playerName || 'المستكشف الصغير'}
            </h4>
            <span className="text-[10px] bg-amber-600 text-white font-bold py-1 px-3 rounded-full inline-block mt-2 relative z-10 shadow-sm leading-none">
              مستوى النجوم: {progress.stars} ⭐
            </span>
          </div>

          {/* Change nickname form */}
          <form onSubmit={handleSaveName} className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">تغيير اسم البطل الصغير:</label>
            <div className="flex gap-2">
              <button
                id="save-name-btn"
                type="submit"
                className="px-5 py-2 w-auto bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl border-b-4 border-green-700 transition-all active:translate-y-1 text-xs"
              >
                تحديث
              </button>
              <input
                id="player-name-input"
                type="text"
                maxLength={14}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="اكتب اسمك الفائز..."
                className="flex-1 px-4 py-2 border-3 border-amber-200 rounded-2xl text-right text-sm font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
