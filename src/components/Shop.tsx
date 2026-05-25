/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProgress, CharacterSkin, PetSkin } from '../types';
import { ShoppingBag, Sparkles, Check, Lock, Gift } from 'lucide-react';
import { sfx } from './AudioEngine';

interface ShopProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onClose: () => void;
}

export const SKIN_ITEMS: CharacterSkin[] = [
  { id: 'skin_default', name: 'المستكشف العادي', avatar: '🧒', cost: 0, unlocked: true },
  { id: 'skin_explorer', name: 'مستكشف الفضاء اللامع', avatar: '👨‍🚀', cost: 150, unlocked: false },
  { id: 'skin_magician', name: 'الساحر الصغير العبقري', avatar: '🧙‍♂️', cost: 250, unlocked: false },
  { id: 'skin_ninja', name: 'نينجا الألغاز السريع', avatar: '🥷', cost: 350, unlocked: false },
  { id: 'skin_detective', name: 'المحقق كولومبو الصغير', avatar: '🕵️‍♂️', cost: 450, unlocked: false },
  { id: 'skin_superhero', name: 'البطل الخارق الحامي', avatar: '🦸‍♂️', cost: 600, unlocked: false },
];

export const PET_ITEMS: PetSkin[] = [
  { id: 'pet_none', name: 'بلا مرافق', avatar: '❌', cost: 0, unlocked: true },
  { id: 'pet_bird', name: 'زقزوق العصفور المغرد', avatar: '🐦', cost: 80, unlocked: false },
  { id: 'pet_cat', name: 'المشمش القط الذكي', avatar: '🐱', cost: 120, unlocked: false },
  { id: 'pet_robot', name: 'الروبوت زيزو المساعد', avatar: '🤖', cost: 180, unlocked: false },
  { id: 'pet_unicorn', name: 'وحيد القرن السحري', avatar: '🦄', cost: 300, unlocked: false },
  { id: 'pet_dragon', name: 'التنين النفّاث الكيوت', avatar: '🐉', cost: 500, unlocked: false },
];

export default function Shop({ progress, onUpdateProgress, onClose }: ShopProps) {
  
  const handleBuyHint = () => {
    const HINT_COST = 30;
    if (progress.coins >= HINT_COST) {
      sfx.playCoin();
      onUpdateProgress({
        ...progress,
        coins: progress.coins - HINT_COST,
        hintsLeft: progress.hintsLeft + 1
      });
    } else {
      sfx.playFail();
    }
  };

  const handleBuySkin = (skin: CharacterSkin) => {
    // Check if pre-unlocked
    const isUnlocked = progress.unlockedSkins.includes(skin.id) || skin.cost === 0;
    if (isUnlocked) {
      sfx.playTap();
      onUpdateProgress({
        ...progress,
        selectedSkinId: skin.id
      });
      return;
    }

    if (progress.coins >= skin.cost) {
      sfx.playLevelUp(); // double celebratory sound!
      onUpdateProgress({
        ...progress,
        coins: progress.coins - skin.cost,
        unlockedSkins: [...progress.unlockedSkins, skin.id],
        selectedSkinId: skin.id
      });
    } else {
      sfx.playFail();
    }
  };

  const handleBuyPet = (pet: PetSkin) => {
    const isUnlocked = progress.unlockedPets.includes(pet.id) || pet.cost === 0;
    if (isUnlocked) {
      sfx.playTap();
      onUpdateProgress({
        ...progress,
        selectedPetId: pet.id
      });
      return;
    }

    if (progress.coins >= pet.cost) {
      sfx.playLevelUp();
      onUpdateProgress({
        ...progress,
        coins: progress.coins - pet.cost,
        unlockedPets: [...progress.unlockedPets, pet.id],
        selectedPetId: pet.id
      });
    } else {
      sfx.playFail();
    }
  };

  return (
    <div id="shop-modal-container" className="bg-white border-4 border-pink-400 soft-card-shadow rounded-3xl p-6 max-w-2xl mx-auto text-right animate-[pop-in_0.3s_ease]">
      {/* Shop Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 mb-6">
        <button
          id="close-shop-btn"
          onClick={onClose}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition-all"
        >
          خروج ❌
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <h3 className="text-2xl font-black text-pink-600 flex items-center gap-1 justify-end">
              <span>متجر الهدايا السحري</span>
              <ShoppingBag className="inline text-pink-500" />
            </h3>
            <p className="text-xs text-slate-400">اشترِ أحلى الأزياء والمرافقين اللطيفين بنقودك الفضية!</p>
          </div>
        </div>
      </div>

      {/* Top Coins & Stars display */}
      <div className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl mb-6 border border-pink-100">
        <div className="flex items-center gap-1 text-slate-700 font-black font-sans text-sm">
          <span>الوسائل المتوفرة: </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">{progress.hintsLeft} 💡 تلميحات</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-white border border-yellow-200 px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-black text-amber-600">
            {progress.coins} 💰
          </span>
          <span className="bg-white border border-yellow-200 px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-black text-indigo-600">
            {progress.stars} ⭐
          </span>
        </div>
      </div>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
        {/* Section 1: Buy Hints */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between flex-row-reverse">
          <div className="text-right space-y-1">
            <h4 className="font-bold text-amber-800 text-base flex items-center justify-end gap-1">
              <span>شراء تلميح ذكي</span>
              <span className="text-xl">💡</span>
            </h4>
            <p className="text-xs text-amber-700">تساعدك ال💡 في حل الألغاز المعقدة عندما تحتار في الجواب!</p>
          </div>
          <button
            id="buy-hint-btn"
            onClick={handleBuyHint}
            disabled={progress.coins < 30}
            className={`px-5 py-2.5 rounded-xl font-bold border-b-4 text-sm transition-all flex items-center gap-1 ${
              progress.coins >= 30
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-700 active:translate-y-1'
                : 'bg-slate-200 text-slate-400 border-slate-300'
            }`}
          >
            <span>💰 30</span>
            <span>شراء تلميح</span>
          </button>
        </div>

        {/* Section 2: Character Skins */}
        <div>
          <h4 className="font-black text-slate-700 text-base mb-3 flex items-center justify-end gap-1 pb-1 border-b border-slate-100">
            <span>ملابس وأقنعة المغامرة</span>
            <Sparkles size={16} className="text-pink-500" />
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SKIN_ITEMS.map((skin) => {
              const objUnlocked = progress.unlockedSkins.includes(skin.id) || skin.cost === 0;
              const isSelected = progress.selectedSkinId === skin.id;
              
              return (
                <div
                  key={skin.id}
                  onClick={() => handleBuySkin(skin)}
                  className={`p-3 rounded-2.5xl border-3 text-center cursor-pointer transition-all hover:scale-105 select-none relative ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50'
                      : objUnlocked
                      ? 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/20'
                      : 'border-slate-100 bg-slate-50 opacity-90'
                  }`}
                >
                  <div className="text-4xl mb-2">{skin.avatar}</div>
                  <div className="text-xs font-bold text-slate-700 truncate mb-2">{skin.name}</div>
                  
                  {isSelected ? (
                    <div className="text-[10px] bg-pink-500 text-white font-bold py-1 px-2 rounded-full inline-flex items-center gap-0.5">
                      <Check size={10} />
                      <span>مرتدي الآن</span>
                    </div>
                  ) : objUnlocked ? (
                    <div className="text-[10px] bg-indigo-500 text-white font-bold py-1 px-2.5 rounded-full inline-block">
                      تغيير المظهر
                    </div>
                  ) : (
                    <div className={`text-[10px] py-1 px-2.5 rounded-full inline-flex items-center gap-1 font-bold ${
                      progress.coins >= skin.cost ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-500'
                    }`}>
                      <Lock size={10} />
                      <span>{skin.cost} 💰</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Cute Companion Pets */}
        <div>
          <h4 className="font-black text-slate-700 text-base mb-3 flex items-center justify-end gap-1 pb-1 border-b border-slate-100">
            <span>حيوانات ومرافقون طيبون</span>
            <Gift size={16} className="text-indigo-500" />
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PET_ITEMS.map((pet) => {
              const objUnlocked = progress.unlockedPets.includes(pet.id) || pet.cost === 0;
              const isSelected = progress.selectedPetId === pet.id;
              
              return (
                <div
                  key={pet.id}
                  onClick={() => handleBuyPet(pet)}
                  className={`p-3 rounded-2.5xl border-3 text-center cursor-pointer transition-all hover:scale-105 select-none relative ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : objUnlocked
                      ? 'border-teal-200 hover:border-teal-400 bg-teal-50/20'
                      : 'border-slate-100 bg-slate-50 opacity-90'
                  }`}
                >
                  <div className="text-4xl mb-2">{pet.avatar}</div>
                  <div className="text-xs font-bold text-slate-700 truncate mb-2">{pet.name}</div>
                  
                  {isSelected ? (
                    <div className="text-[10px] bg-indigo-500 text-white font-bold py-1 px-2 rounded-full inline-flex items-center gap-0.5">
                      <Check size={10} />
                      <span>مرافقك الحارس</span>
                    </div>
                  ) : objUnlocked ? (
                    <div className="text-[10px] bg-teal-500 text-white font-bold py-1 px-2.5 rounded-full inline-block">
                      اختر الرفيق
                    </div>
                  ) : (
                    <div className={`text-[10px] py-1 px-2.5 rounded-full inline-flex items-center gap-1 font-bold ${
                      progress.coins >= pet.cost ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-500'
                    }`}>
                      <Lock size={10} />
                      <span>{pet.cost} 💰</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
