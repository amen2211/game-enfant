/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { World, WorldId, UserProgress } from '../types';
import { Lock, Star, Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { sfx } from './AudioEngine';

interface WorldMapProps {
  progress: UserProgress;
  onSelectWorld: (worldId: WorldId) => void;
}

export const WORLDS_LIST: World[] = [
  { id: WorldId.Math, name: 'عالم الرياضيات والأرقام', description: 'مسائل شيّقة، موازين، وجمع كتل فواكه لطيفة!', icon: '🧮', accentColor: 'border-yellow-300 bg-yellow-50 text-yellow-800', bannerColor: 'bg-amber-400', minStarsRequired: 0 },
  { id: WorldId.Memory, name: 'عالم الذاكرة والحفظ', description: 'طابق كروت اللعب الملونة وعزز سرعة تذكرك!', icon: '🧠', accentColor: 'border-teal-300 bg-teal-50 text-teal-850', bannerColor: 'bg-teal-400', minStarsRequired: 1 },
  { id: WorldId.Colors, name: 'عالم الألوان الساحر', description: 'اخلط كيمياء السوائل الملونة وتعرف على الأنماط!', icon: '🎨', accentColor: 'border-pink-300 bg-pink-50 text-pink-850', bannerColor: 'bg-pink-400', minStarsRequired: 3 },
  { id: WorldId.Words, name: 'عالم الحروف والكلمات', description: 'رتب الحروف الضائعة لتسمية الكائنات والأشكال!', icon: '✍️', accentColor: 'border-sky-300 bg-sky-50 text-sky-850', bannerColor: 'bg-sky-400', minStarsRequired: 5 },
  { id: WorldId.Mazes, name: 'عالم المتاهات والخرائط', description: 'وجه القطة مشمش وتفادى جدران الأخشاب للوصول للهدف!', icon: '🧭', accentColor: 'border-emerald-300 bg-emerald-50 text-emerald-850', bannerColor: 'bg-emerald-400', minStarsRequired: 8 },
  { id: WorldId.Secret, name: 'عالم الغرف السرية والأقفال', description: 'حل الألغاز الشعبية والحزازير لفتح الأبواب العتيقة!', icon: '🔑', accentColor: 'border-indigo-300 bg-indigo-50 text-indigo-850', bannerColor: 'bg-indigo-400', minStarsRequired: 12 },
  { id: WorldId.Logic, name: 'عالم الذكاء والمنطق العبقري', description: 'أكمل المتطابقات والتسلسلات وتحقق من عقول الأذكياء!', icon: '⚡', accentColor: 'border-purple-300 bg-purple-50 text-purple-850', bannerColor: 'bg-purple-400', minStarsRequired: 15 },
  { id: WorldId.Hidden, name: 'عالم الصورة المخفية والعدسة', description: 'البحث عن الشكل الغريب والأيقونات داخل الملاعب المزدحمة!', icon: '🔍', accentColor: 'border-rose-300 bg-rose-50 text-rose-850', bannerColor: 'bg-rose-400', minStarsRequired: 18 },
];

export default function WorldMap({ progress, onSelectWorld }: WorldMapProps) {
  
  const handleWorldClick = (world: World) => {
    // Check if enough stars to enter world
    const unlocked = progress.stars >= world.minStarsRequired;
    if (unlocked) {
      sfx.playTap();
      onSelectWorld(world.id);
    } else {
      sfx.playFail();
    }
  };

  return (
    <div id="worlds-map-block" className="space-y-6">
      <div className="text-right space-y-1 bg-white/40 backdrop-blur-md p-4 rounded-3xl border-3 border-white/50 shadow-sm">
        <h3 className="text-2xl font-black text-blue-950 flex items-center justify-end gap-2">
          <span>خريطة عوالم الذكاء الثمانية</span>
          <Compass className="text-amber-500 animate-spin-slow" size={24} />
        </h3>
        <p className="text-xs font-bold text-slate-700 leading-relaxed">اختر عالماً سحرياً لبدء مغامرة الألغاز الشيقة وإحراز المزيد من النقاط والمكافآت العالية! 🏆</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {WORLDS_LIST.map((world, index) => {
          const isUnlocked = progress.stars >= world.minStarsRequired;
          const currentLevel = progress.levelProgress[world.id] || 1;
          const percentageComplete = Math.min(100, Math.round(((currentLevel - 1) / 10) * 100));

          // Map world helper classes based on ID
          let cardTypeClass = 'bold-card-yellow';
          let shinySkew = 'skew-x-12';
          if (world.id === WorldId.Memory) { cardTypeClass = 'bold-card-purple'; shinySkew = '-skew-x-12'; }
          else if (world.id === WorldId.Colors) { cardTypeClass = 'bold-card-orange'; shinySkew = 'skew-y-6'; }
          else if (world.id === WorldId.Words) { cardTypeClass = 'bold-card-blue'; shinySkew = '-skew-y-3'; }
          else if (world.id === WorldId.Mazes) { cardTypeClass = 'bold-card-emerald'; shinySkew = 'skew-x-6'; }
          else if (world.id === WorldId.Secret) { cardTypeClass = 'bold-card-red'; shinySkew = 'skew-y-12'; }
          else if (world.id === WorldId.Logic) { cardTypeClass = 'bold-card-indigo'; shinySkew = '-skew-x-6'; }
          else if (world.id === WorldId.Hidden) { cardTypeClass = 'bold-card-pink'; shinySkew = 'skew-x-12'; }

          const rotationClass = index % 4 === 0 ? '-rotate-2' : index % 4 === 1 ? 'rotate-2' : index % 4 === 2 ? '-rotate-1' : 'rotate-3';

          return (
            <div
              key={world.id}
              onClick={() => handleWorldClick(world)}
              id={`world-card-${world.id}`}
              className={`group relative p-5 rounded-[2.5rem] cursor-pointer transition-all duration-300 transform select-none flex flex-col justify-between h-56 overflow-hidden ${rotationClass} ${
                isUnlocked 
                  ? `${cardTypeClass} hover:scale-105 active:scale-98 text-white` 
                  : 'bg-slate-300/80 border-8 border-white rounded-[2.5rem] shadow-xl text-slate-500 opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Inner shiny vector reflection style */}
              <div className={`absolute inset-0 bg-white/20 opacity-35 pointer-events-none transform ${shinySkew} transition-transform duration-500 group-hover:scale-110`}></div>

              {/* Star Gate Lock icon if locked */}
              {!isUnlocked && (
                <div className="absolute top-3 left-3 bg-red-500 border-2 border-white text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-black z-10 shadow-md">
                  <Lock size={12} />
                  <span>تطلب {world.minStarsRequired} ⭐</span>
                </div>
              )}

              {/* Header icons and title */}
              <div className="flex justify-between items-start flex-row-reverse mb-3 z-5">
                <span className="text-6xl filter drop-shadow animate-kids-bounce select-none">{world.icon}</span>
                <div className="text-right flex-1 max-w-[200px]">
                  <h4 className={`font-black text-lg ${isUnlocked ? 'text-white drop-shadow-sm' : 'text-slate-700'}`}>{world.name}</h4>
                  <p className={`text-xs mt-1.5 font-bold leading-relaxed pr-1 ${isUnlocked ? 'text-white/90' : 'text-slate-500'}`}>{world.description}</p>
                </div>
              </div>

              {/* Progress and indicators */}
              <div className={`border-t pt-3.5 mt-2 flex justify-between items-center flex-row-reverse z-5 ${isUnlocked ? 'border-white/30' : 'border-slate-400/20'}`}>
                {isUnlocked ? (
                  <>
                    <span className="font-mono text-xs font-black bg-white/30 border border-white/45 px-3 py-1 rounded-full inline-block text-white">
                      مستوى: {currentLevel} 🏆
                    </span>
                    <div className="space-y-1.5 w-7/12 text-right">
                      {/* Sub progress line */}
                      <div className="flex justify-between items-center text-[10px] font-black text-white">
                        <span>{percentageComplete}%</span>
                        <span>بطل المسار</span>
                      </div>
                      <div className="w-full bg-black/25 h-2.5 rounded-full overflow-hidden border border-white/20">
                        <div className="bg-yellow-300 h-full rounded-full transition-all duration-500" style={{ width: `${percentageComplete}%` }}></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center py-1">
                    <span className="text-xs font-black text-red-600 leading-none flex items-center justify-center gap-1 bg-red-50/90 py-1.5 px-3 rounded-full border border-red-200">
                      بوابة مقفلة بطلب النجوم! ⭐
                    </span>
                  </div>
                )}
              </div>

              {/* Overlay styling for locker if locked */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-slate-900/40 rounded-[2.25rem] flex items-center justify-center z-8">
                  <div className="w-14 h-14 bg-black/60 rounded-full border-2 border-white/40 flex items-center justify-center text-white text-3xl shadow-xl">
                    🔒
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
