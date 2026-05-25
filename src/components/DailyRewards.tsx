/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserProgress } from '../types';
import { Sparkles, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { sfx } from './AudioEngine';

interface DailyRewardsProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onClose: () => void;
}

export default function DailyRewards({ progress, onUpdateProgress, onClose }: DailyRewardsProps) {
  const [openedChestIdx, setOpenedChestIdx] = useState<number | null>(null);
  const [rewardDetails, setRewardDetails] = useState<{ coins: number; stars: number } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const alreadyClaimed = progress.claimedDailyRewards.includes(todayStr);

  const handleOpenChest = (chestIndex: number) => {
    if (alreadyClaimed || openedChestIdx !== null) return;
    
    // Generate reward
    const coinsReward = 60 + Math.floor(Math.random() * 80); // 60 - 140 coins
    const starsReward = 2 + Math.floor(Math.random() * 2); // 2 or 3 stars
    
    sfx.playLevelUp(); // celebrate sound
    
    setOpenedChestIdx(chestIndex);
    setRewardDetails({ coins: coinsReward, stars: starsReward });
    
    // Update progress state
    onUpdateProgress({
      ...progress,
      coins: progress.coins + coinsReward,
      stars: progress.stars + starsReward,
      claimedDailyRewards: [...progress.claimedDailyRewards, todayStr]
    });
  };

  return (
    <div id="daily-rewards-modal" className="bg-white border-4 border-amber-400 soft-card-shadow rounded-3xl p-6 max-w-md mx-auto text-right animate-[pop-in_0.3s_ease]">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 mb-6">
        <button
          id="close-rewards-btn"
          onClick={onClose}
          className="px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl text-xs transition-all"
        >
          رجوع ✕
        </button>
        <div className="flex items-center gap-1.5">
          <Calendar className="text-amber-500" size={20} />
          <h3 className="text-xl font-black text-amber-700">صناديق المكافآت اليومية</h3>
        </div>
      </div>

      {!alreadyClaimed && openedChestIdx === null ? (
        <div className="text-center">
          <p className="text-slate-600 font-sans text-sm mb-6 leading-relaxed">
            مرحباً بك يا بطل! 🎁 اختر واحداً من الصناديق السحرية الثلاثة لتحصل على نقودك الذهبية ونجومك المجانية في هذا اليوم الجميل!
          </p>

          <div className="flex justify-center gap-4 py-4">
            {[
              { label: 'صندوق الأمل الأخضر', color: 'from-emerald-400 to-green-500', icon: '🟢📦' },
              { label: 'صندوق الياقوت الخارق', color: 'from-amber-400 to-orange-500', icon: '🟡📦' },
              { label: 'صندوق الفضاء السحري', color: 'from-indigo-400 to-blue-500', icon: '🔵📦' }
            ].map((chest, idx) => (
              <button
                id={`chest-btn-${idx}`}
                key={idx}
                onClick={() => handleOpenChest(idx)}
                className={`flex-1 p-4 rounded-2.5xl bg-gradient-to-b ${chest.color} text-white font-bold soft-card-shadow hover:-translate-y-2 hover:scale-105 active:translate-y-0 transition-all flex flex-col items-center border-b-6 border-black/20`}
              >
                <span className="text-4xl mb-2 filter drop-shadow animate-bounce">{chest.icon.slice(0, 2)}</span>
                <span className="text-[10px] whitespace-nowrap leading-tight">{chest.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      ) : alreadyClaimed && openedChestIdx === null ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h4 className="text-lg font-black text-green-700">لقد فتحت صندوق اليوم بنجاح!</h4>
          <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            أنت رائع ومجتهد! ترقب الهدايا والصناديق الذهبية القادمة غداً عند بزوغ الفجر لربح المزيد من الجوائز. استمر في حل الألغاز الآن!
          </p>
          <div className="flex justify-center gap-1 text-slate-400 text-xs font-semibold">
            <span>التاريخ اليوم: {todayStr} 📅</span>
          </div>
        </div>
      ) : (
        /* Reward display screen with colorful particles */
        <div className="text-center space-y-4 py-4 animate-[pop-in_0.4s_ease]">
          <div className="text-6xl animate-bounce">🎁🎉</div>
          <h4 className="text-xl font-black text-amber-600 flex items-center justify-center gap-1">
            <span>مبروك! كنز رائع</span>
            <Sparkles size={18} className="text-yellow-500" />
          </h4>
          
          <div className="flex justify-center gap-4 py-2">
            <div className="bg-amber-100 text-amber-800 border-2 border-amber-300 px-5 py-3 rounded-2xl font-black text-base soft-card-shadow">
              + {rewardDetails?.coins} 💰
            </div>
            <div className="bg-indigo-100 text-indigo-800 border-2 border-indigo-300 px-5 py-3 rounded-2xl font-black text-base soft-card-shadow">
              + {rewardDetails?.stars} ⭐
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed">
            تمت المضافرة بنجاح إلى رصيدك الذهبي! يمكنك الاستفادة منها لشراء الرفاق أو تغيير مظهر بطلك الصغير من المتجر!
          </p>

          <button
            id="accept-rewards-btn"
            onClick={onClose}
            className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl border-b-4 border-green-700 transition-all active:translate-y-1"
          >
            شكراً يا أصدقاء! 👍
          </button>
        </div>
      )}
    </div>
  );
}
