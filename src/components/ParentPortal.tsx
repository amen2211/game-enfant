/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProgress, ParentSettings, WorldId } from '../types';
import { Grid, BarChart, Heart, Clock, Award, CheckCircle, ShieldAlert, BookOpen } from 'lucide-react';
import { sfx } from './AudioEngine';

interface ParentPortalProps {
  progress: UserProgress;
  settings: ParentSettings;
  onUpdateSettings: (settings: ParentSettings) => void;
  onClose: () => void;
}

export default function ParentPortal({
  progress,
  settings,
  onUpdateSettings,
  onClose
}: ParentPortalProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [numA] = useState(6 + Math.floor(Math.random() * 4)); // 6-9
  const [numB] = useState(7 + Math.floor(Math.random() * 3)); // 7-9
  const [parentAnswer, setParentAnswer] = useState('');
  const [gateError, setGateError] = useState(false);

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    const correctVal = numA * numB;
    if (parseInt(parentAnswer, 10) === correctVal) {
      setIsLocked(false);
      setGateError(false);
      sfx.playSuccess();
    } else {
      setGateError(true);
      sfx.playFail();
    }
  };

  // Metric calculation based on world levels solved
  const getSkillStrength = (worldId: WorldId) => {
    const level = progress.levelProgress[worldId] || 1;
    // Level 1: 10%, Level 5: 50%, etc.
    const percentage = Math.min(100, Math.round(((level - 1) / 10) * 100));
    return percentage > 0 ? percentage : 10;
  };

  const totalLevelsSolved = Object.values(progress.levelProgress).reduce((acc, curr) => acc + (curr - 1), 0);

  if (isLocked) {
    return (
      <div id="parent-gate-card" className="bg-white soft-card-shadow border-4 border-amber-400 rounded-3xl p-6 max-w-md mx-auto text-right animate-[pop-in_0.3s_ease]">
        <div className="flex justify-between items-center mb-6">
          <button
            id="close-gate-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold flex items-center justify-center transition-transform hover:scale-110"
          >
            ✕
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <h3 className="text-xl font-bold text-slate-800">بوابة أولياء الأمور</h3>
          </div>
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          هذه المنطقة مخصصة لأولياء الأمور لمتابعة تقارير الذكاء وتنظيم وقت اللعب. لحماية طفلك، يرجى حل هذه المسألة الحسابية للعبور:
        </p>

        <form onSubmit={handleVerifyGate} className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-2xl border-2 border-dashed border-amber-300 text-center">
            <span className="text-3xl font-black text-amber-700 font-mono tracking-wider">
              {numA} × {numB} = ؟
            </span>
          </div>

          <div className="flex gap-2">
            <button
              id="submit-gate-btn"
              type="submit"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl border-b-4 border-green-700 transition-all active:translate-y-1"
            >
              تحقق ودخول
            </button>
            <input
              id="gate-answer-input"
              type="number"
              value={parentAnswer}
              onChange={(e) => setParentAnswer(e.target.value)}
              placeholder="اكتب الإجابة هنا..."
              className="flex-1 px-4 py-3 border-3 border-amber-200 rounded-2.5xl text-center text-xl font-bold focus:outline-none focus:border-amber-400"
              autoFocus
            />
          </div>

          {gateError && (
            <p className="text-red-500 text-sm font-bold flex items-center gap-1 justify-end">
              <span>إجابة غير صحيحة، حاول مجدداً! 🤔</span>
              <ShieldAlert size={16} />
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div id="parent-dashboard-container" className="bg-white soft-card-shadow border-4 border-indigo-400 rounded-3xl p-6 max-w-3xl mx-auto text-right animate-[pop-in_0.3s_ease]">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 mb-6">
        <button
          id="close-parent-dashboard-btn"
          onClick={onClose}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
        >
          رجوع للعبة 🎮
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h3 className="text-2xl font-black text-indigo-700">تقارير ذكاء الطفل </h3>
            <p className="text-xs text-slate-400 leading-none mt-1">مسار التطوير وتحليلات الأداء لـ {progress.playerName || 'البطل الصغير'}</p>
          </div>
          <span className="text-3xl">📊</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Dynamic Analytics */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-gradient-to-l from-indigo-50 to-purple-50 p-5 rounded-2.5xl border border-indigo-100">
            <h4 className="font-bold text-indigo-800 text-lg mb-4 flex items-center justify-end gap-2">
              <span>المهارات الذهنية الـخمس</span>
              <BookOpen size={20} className="text-indigo-600" />
            </h4>

            <div className="space-y-4">
              {/* Math skill */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{getSkillStrength(WorldId.Math)}%</span>
                  <span>الرياضيات والحساب الذهني (عالم الرياضيات)</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getSkillStrength(WorldId.Math)}%` }}></div>
                </div>
              </div>

              {/* Memory skill */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{getSkillStrength(WorldId.Memory)}%</span>
                  <span>قوة الحفظ والذاكرة البصرية (عالم الذاكرة)</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-teal-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getSkillStrength(WorldId.Memory)}%` }}></div>
                </div>
              </div>

              {/* Language spelling skill */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{getSkillStrength(WorldId.Words)}%</span>
                  <span>اللغة والتراكيب الإملائية (عالم الحروف والكلمات)</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getSkillStrength(WorldId.Words)}%` }}></div>
                </div>
              </div>

              {/* Spatial / Maze logic */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{getSkillStrength(WorldId.Mazes)}%</span>
                  <span>التوجيه الجغرافي وحل المتاهات (عالم المتاهات)</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getSkillStrength(WorldId.Mazes)}%` }}></div>
                </div>
              </div>

              {/* Pure logic & puzzle-solving reasoning */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{getSkillStrength(WorldId.Logic)}%</span>
                  <span>المنطق والاستدلال التحليلي (عالم الذكاء والمنطق)</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-pink-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getSkillStrength(WorldId.Logic)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Child developmental recommendation */}
          <div className="bg-green-50 p-4 rounded-2xl border border-green-200 flex items-start gap-3 flex-row-reverse text-right">
            <div className="p-2 bg-green-100 rounded-xl text-green-700">
              <Heart size={24} />
            </div>
            <div>
              <h5 className="font-bold text-green-800 text-sm">نصيحة تربوية مخصصة:</h5>
              <p className="text-xs text-green-700 mt-1 leading-relaxed">
                {totalLevelsSolved < 3 
                  ? "البطل الصغير في بداية رحلته الاستكشافية! شجعه على حل ألغاز الرياضيات البسيطة لبناء ثقته بنفسه وتطوير الحافز الداخلي."
                  : "رائع! يُظهر طفلك قدرة متميزة في التفكير التحليلي والتركيز الصوري. ننصح بموازنة فترات اللعب بمعدل 20-30 دقيقة يومياً لحماية صحة العينين وتثبيت مهارات الذاكرة."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Stats & Parenting Screen Controls */}
        <div className="space-y-6">
          {/* Active Statistics Card */}
          <div className="bg-slate-50 p-5 rounded-2.5xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-700 text-sm mb-2 pb-2 border-b border-slate-200">الأرقام القياسية المحققة</h4>
            
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-800">{progress.stars} ⭐</span>
              <span className="text-slate-500">مجموع النجوم المجمعة:</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-800">{progress.coins} 💰</span>
              <span className="text-slate-500">القطع الذهبية الحالية:</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-800">{totalLevelsSolved} مستوى</span>
              <span className="text-slate-500">الألغاز المحلولة بنجاح:</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-800">{progress.unlockedSkins.length + progress.unlockedPets.length} عناصر</span>
              <span className="text-slate-500">ملابس وحيوانات تم فتحها:</span>
            </div>
          </div>

          {/* Parenting moderation knobs */}
          <div className="bg-amber-50 p-5 rounded-2.5xl border border-amber-200 space-y-4">
            <h4 className="font-bold text-amber-800 text-sm flex items-center justify-end gap-1">
              <span>أدوات إدارة وقت اللعب</span>
              <Clock size={16} />
            </h4>

            {/* Restrict play time toggle */}
            <div className="flex items-center justify-between text-xs gap-4">
              <button
                id="toggle-time-limit-btn"
                onClick={() => {
                  sfx.playTap();
                  onUpdateSettings({
                    ...settings,
                    restrictPlayTime: !settings.restrictPlayTime
                  });
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                  settings.restrictPlayTime 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.restrictPlayTime ? 'مُفعّل ⏱️' : 'مُغلق 🔓'}
              </button>
              <span className="text-amber-900 font-semibold">تحديد وقت اللعب اليومي (30 دقيقة):</span>
            </div>

            <p className="text-[10px] text-amber-700 leading-normal text-right">
              عند التفعيل، ستظهر رسالة كرتونية لطيفة بعد انقضاء 30 دقيقة تنصح طفلك بأخذ راحة قصيرة واللعب لاحقاً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
