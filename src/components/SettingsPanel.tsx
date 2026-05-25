/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ParentSettings, Difficulty } from '../types';
import { Volume2, VolumeX, Music, Shield, Info, Sliders } from 'lucide-react';
import { sfx } from './AudioEngine';

interface SettingsPanelProps {
  settings: ParentSettings;
  onUpdateSettings: (settings: ParentSettings) => void;
  onOpenParentPortal: () => void;
  onClose: () => void;
}

export default function SettingsPanel({
  settings,
  onUpdateSettings,
  onOpenParentPortal,
  onClose
}: SettingsPanelProps) {

  const handleToggleMuteSFX = () => {
    const nextVal = !settings.sfxOn;
    sfx.setMute(!nextVal);
    onUpdateSettings({ ...settings, sfxOn: nextVal });
    if (nextVal) sfx.playTap();
  };

  const handleToggleMusic = () => {
    const nextVal = !settings.musicOn;
    onUpdateSettings({ ...settings, musicOn: nextVal });
    
    if (nextVal) {
      sfx.startBackgroundMusic();
      sfx.playTap();
    } else {
      sfx.stopBackgroundMusic();
    }
  };

  const handleChangeDifficulty = (diff: Difficulty) => {
    sfx.playTap();
    onUpdateSettings({ ...settings, difficulty: diff });
  };

  return (
    <div id="settings-panel-container" className="bg-white border-4 border-indigo-400 soft-card-shadow rounded-3xl p-6 max-w-md mx-auto text-right animate-[pop-in_0.3s_ease]">
      {/* Settings Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 mb-6">
        <button
          id="close-settings-btn"
          onClick={onClose}
          className="px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl text-xs transition-all"
        >
          حفظ وإغلاق ✕
        </button>
        <div className="flex items-center gap-1.5">
          <Sliders className="text-indigo-500" size={20} />
          <h3 className="text-xl font-black text-indigo-700">خيارات اللعبة والإعدادات</h3>
        </div>
      </div>

      <div className="space-y-6">
        {/* Audio toggles card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-slate-700 text-sm pb-1 border-b border-slate-100">الأصوات والمؤثرات</h4>
          
          {/* SFX sound effects toggle */}
          <div className="flex items-center justify-between flex-row-reverse text-right">
            <span className="text-xs text-slate-600 font-bold">المؤثرات الصوتية والقرعات:</span>
            <button
              id="toggle-sfx-btn"
              onClick={handleToggleMuteSFX}
              className={`p-2.5 rounded-2xl font-bold border-b-4 transition-all flex items-center gap-1 text-xs ${
                settings.sfxOn 
                  ? 'bg-green-500 text-white border-green-700 hover:bg-green-600' 
                  : 'bg-slate-300 text-slate-600 border-slate-400'
              }`}
            >
              {settings.sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{settings.sfxOn ? 'مفتوح 📣' : 'مكتوم 🔇'}</span>
            </button>
          </div>

          {/* Background Music toggle */}
          <div className="flex items-center justify-between flex-row-reverse text-right">
            <span className="text-xs text-slate-600 font-bold">الموسيقى الخلفية الهادئة:</span>
            <button
              id="toggle-music-btn"
              onClick={handleToggleMusic}
              className={`p-2.5 rounded-2xl font-bold border-b-4 transition-all flex items-center gap-1 text-xs ${
                settings.musicOn 
                  ? 'bg-indigo-500 text-white border-indigo-700 hover:bg-indigo-600' 
                  : 'bg-slate-300 text-slate-600 border-slate-400'
              }`}
            >
              <Music size={16} />
              <span>{settings.musicOn ? 'عازف 🎵' : 'صامت 🔇'}</span>
            </button>
          </div>
        </div>

        {/* Difficulty Modes selection for child */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
          <h4 className="font-bold text-amber-900 text-sm">مستوى ذكاء الألغاز</h4>
          <div className="grid grid-cols-3 gap-2">
            {[Difficulty.Easy, Difficulty.Medium, Difficulty.Hard].map((diff) => {
              const isActive = settings.difficulty === diff;
              return (
                <button
                  id={`diff-btn-${diff}`}
                  key={diff}
                  onClick={() => handleChangeDifficulty(diff)}
                  className={`py-2 px-3 rounded-2xl font-bold border-b-4 text-xs transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-700'
                      : 'bg-white hover:bg-amber-100/50 text-amber-800 border-amber-200'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-amber-700 leading-normal text-right">
            تتحكم الصعوبة بمستوى تعقيد أسئلة الرياضيات والذاكرة والمنطق لجعلها مناسبة لسنِّ طفلك المميز.
          </p>
        </div>

        {/* Parent Portal Area */}
        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 text-center">
          <h4 className="font-bold text-indigo-900 text-sm mb-2">منطقة الآباء والتقارير</h4>
          <p className="text-[10px] text-indigo-700 mb-3 block">
            يمكن لأولياء الأمور تخصيص الوقت، ومراجعة تفصيل مهارات تفكير طفلهم الرياضية واللفظية والذهنية.
          </p>
          <button
            id="parent-gate-btn"
            onClick={() => {
              sfx.playTap();
              onOpenParentPortal();
            }}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl border-b-4 border-indigo-800 text-xs transition-all flex items-center justify-center gap-1"
          >
            <Shield size={14} />
            <span>عرض بوابه أولياء الأمور (يطلب حل مسألة حسابية فنية)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
