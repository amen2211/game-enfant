/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorldId, PuzzleQuestion, Difficulty } from '../types';
import { getPuzzle } from '../utils/puzzleGenerator';
import { sfx } from './AudioEngine';
import { ArrowLeft, Lightbulb, HelpCircle, Flame, Star, Coins, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface PuzzlePlayerProps {
  worldId: WorldId;
  levelNumber: number;
  hintsCount: number;
  onUseHint: () => void;
  onPuzzleSuccess: (starsEarned: number, coinsEarned: number) => void;
  onBackToMap: () => void;
}

export default function PuzzlePlayer({
  worldId,
  levelNumber,
  hintsCount,
  onUseHint,
  onPuzzleSuccess,
  onBackToMap
}: PuzzlePlayerProps) {
  // Load the puzzle question
  const [puzzle, setPuzzle] = useState<PuzzleQuestion>(() => getPuzzle(worldId, levelNumber));
  
  // Visual states
  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHintMsg, setShowHintMsg] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [guidePhrase, setGuidePhrase] = useState('');

  // 1. MEMORY MATCH CARDS STATE
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [selectedCardIndices, setSelectedCardIndices] = useState<number[]>([]);

  // 2. COLOR MIX STATE
  const [chosenMixColors, setChosenMixColors] = useState<string[]>([]);

  // 3. WORD SPELLER STATE
  const [builtSpelling, setBuiltSpelling] = useState<string[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<string[]>([]);

  // 4. MAZE STATE
  const [mazeCat, setMazeCat] = useState({ x: 0, y: 0 });

  // 5. HIDDEN GRID ITEMS
  const [flippedHiddenIdx, setFlippedHiddenIdx] = useState<number[]>([]);

  // Initialize/reset puzzle whenever level changes
  useEffect(() => {
    const initializedPuzzle = getPuzzle(worldId, levelNumber);
    setPuzzle(initializedPuzzle);
    
    // Reset all interactive states
    setSelectedChoice(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowHintMsg(false);
    setAttempts(1);

    // Initial guide greetings in Arabic
    const greetings = [
      'مرحباً بك يا بطل! أنا مشمش 🐱 وسأساعدك في هذا التحدي الذكي!',
      'زيزو الروبوت 🤖 جاهز لمساعدتك! ما رأيك في حل هذا اللغز معنا؟',
      'زقزوق العصفور 🐦 يغرد فرحاً بقدومك! ركز جيداً في السؤال لتكسب النجوم!',
      'قائد الحكمة يراقبك، أظهر للجميع قوة عقلك الفائق! 🌟'
    ];
    setGuidePhrase(greetings[levelNumber % greetings.length]);

    // Setup Category-specific initialization
    if (initializedPuzzle.data.type === 'card_matching') {
      setMemoryCards(initializedPuzzle.data.cards);
      setSelectedCardIndices([]);
    }

    if (initializedPuzzle.data.type === 'color_blend') {
      setChosenMixColors([]);
    }

    if (initializedPuzzle.data.type === 'word_builder') {
      setBuiltSpelling([]);
      setRemainingLetters(initializedPuzzle.data.scrambled);
    }

    if (initializedPuzzle.data.type === 'maze_grid') {
      setMazeCat(initializedPuzzle.data.catPos);
    }

    if (initializedPuzzle.data.type === 'find_odd') {
      setFlippedHiddenIdx([]);
    }
  }, [worldId, levelNumber]);

  // Guide reactions on results
  const updateGuideCharacterReaction = (correct: boolean) => {
    if (correct) {
      const positivePhrases = [
        'أنت رائع ومذهل جداً! طريقتك في التفكير ذكية خارقة! 🎉',
        'ما شاء الله! حل عبقري سريع، لقد كسبت قلوب الجميع! 💖',
        'رائع! لقد اهتزت أرجاء مدينة الألغاز فرحاً بفوزك الأسطوري! 🌟',
        'زيزو الروبوت سعيد جداً ويرقص من الفرح! 🤖✨'
      ];
      setGuidePhrase(positivePhrases[Math.floor(Math.random() * positivePhrases.length)]);
    } else {
      const encouragePhrases = [
        'مم، إجابة قريبة جداً! لا تحزن يا بطل وحاول مرة أخرى! 🤔',
        'مشمش القط يهمس لك: فكر بهدوء واستخدم التلميح السحري للحل! 💡',
        'العصفور يغرد: بالتأكيد ستعرفها في المحاولة القادمة، لا تستسلم! 🐦',
        'خطوة بسيطة متبقية، ركز في الألوان والأرقام لتصيب الهدف! 🎯'
      ];
      setGuidePhrase(encouragePhrases[Math.floor(Math.random() * encouragePhrases.length)]);
    }
  };

  const handleGeneralChoiceSubmit = (choice: any) => {
    if (isAnswered && isCorrect) return; // Prevent multiple clicks on success
    
    setSelectedChoice(choice);
    const correctVal = puzzle.correctAnswer;
    
    if (choice === correctVal) {
      sfx.playSuccess();
      setIsCorrect(true);
      setIsAnswered(true);
      updateGuideCharacterReaction(true);
    } else {
      sfx.playFail();
      setIsCorrect(false);
      setAttempts(prev => prev + 1);
      updateGuideCharacterReaction(false);
      // Let it remain false briefly so they can attempt again
      setTimeout(() => {
        setIsCorrect(null);
      }, 1500);
    }
  };

  // --- MEMORY MATCH CARDS RESOLVER ---
  const handleMemoryCardTap = (cardIdx: number) => {
    if (isAnswered) return;
    if (selectedCardIndices.length >= 2) return;
    if (memoryCards[cardIdx].isMatched || memoryCards[cardIdx].isFlipped) return;

    sfx.playCardFlip();
    
    const updated = [...memoryCards];
    updated[cardIdx].isFlipped = true;
    setMemoryCards(updated);

    const newIndices = [...selectedCardIndices, cardIdx];
    setSelectedCardIndices(newIndices);

    if (newIndices.length === 2) {
      const first = memoryCards[newIndices[0]];
      const second = memoryCards[newIndices[1]];

      if (first.icon === second.icon) {
        // Matched!
        setTimeout(() => {
          sfx.playCoin();
          const matchedList = updated.map((card, i) => {
            if (i === newIndices[0] || i === newIndices[1]) {
              return { ...card, isMatched: true, isFlipped: true };
            }
            return card;
          });
          setMemoryCards(matchedList);
          setSelectedCardIndices([]);

          // Check Win Condition
          const allMatched = matchedList.every(c => c.isMatched);
          if (allMatched) {
            sfx.playSuccess();
            setIsAnswered(true);
            setIsCorrect(true);
            updateGuideCharacterReaction(true);
          }
        }, 500);
      } else {
        // Mismatch - Flip back after delay
        setTimeout(() => {
          sfx.playCardFlip();
          const resetList = updated.map((card, i) => {
            if (i === newIndices[0] || i === newIndices[1]) {
              return { ...card, isFlipped: false };
            }
            return card;
          });
          setMemoryCards(resetList);
          setSelectedCardIndices([]);
        }, 1200);
      }
    }
  };

  // --- COLOR BLEND RESOLVER ---
  const handleColorBlendSelection = (color: string) => {
    if (isAnswered) return;
    sfx.playTap();

    let updated = [...chosenMixColors];
    if (updated.includes(color)) {
      updated = updated.filter(c => c !== color);
    } else {
      if (updated.length < 2) {
        updated.push(color);
      } else {
        // replace last
        updated[1] = color;
      }
    }
    setChosenMixColors(updated);
  };

  const handleMixColorsSubmit = () => {
    if (chosenMixColors.length < 2) return;
    
    // Check if both colors match correctPair list
    const actualPair = chosenMixColors.map(c => c.replace(/[^\u0621-\u064A]/g, '')); // clean to arabic text only
    const targetPair = puzzle.data.correctPair;

    const isMatch = actualPair.every(c => targetPair.includes(c)) && targetPair.every((c: string) => actualPair.includes(c));

    if (isMatch) {
      sfx.playSuccess();
      setIsAnswered(true);
      setIsCorrect(true);
      updateGuideCharacterReaction(true);
    } else {
      sfx.playFail();
      setIsCorrect(false);
      setAttempts(prev => prev + 1);
      updateGuideCharacterReaction(false);
      setChosenMixColors([]);
      setTimeout(() => {
        setIsCorrect(null);
      }, 1500);
    }
  };

  // --- ARABIC WORD BUILDER RESOLVER ---
  const handleWordTileTap = (char: string, index: number, isFromBuilt: boolean) => {
    if (isAnswered) return;
    sfx.playCardFlip();

    if (isFromBuilt) {
      // Return to scrambled pool
      const updatedBuilt = [...builtSpelling];
      updatedBuilt.splice(index, 1);
      setBuiltSpelling(updatedBuilt);
      setRemainingLetters([...remainingLetters, char]);
    } else {
      // Append to spelling
      const updatedRemaining = [...remainingLetters];
      updatedRemaining.splice(index, 1);
      setRemainingLetters(updatedRemaining);
      setBuiltSpelling([...builtSpelling, char]);
    }
  };

  const handleVerifySpelling = () => {
    const finalWord = builtSpelling.join('');
    if (finalWord === puzzle.correctAnswer) {
      sfx.playSuccess();
      setIsAnswered(true);
      setIsCorrect(true);
      updateGuideCharacterReaction(true);
    } else {
      sfx.playFail();
      setIsCorrect(false);
      setAttempts(prev => prev + 1);
      updateGuideCharacterReaction(false);
      // Reset speller letters
      setBuiltSpelling([]);
      setRemainingLetters(puzzle.data.scrambled);
      setTimeout(() => {
        setIsCorrect(null);
      }, 1500);
    }
  };

  // --- MAZE MOVEMENT RESOLVER ---
  const handleMazeMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (isAnswered) return;
    sfx.playCardFlip();

    let newX = mazeCat.x;
    let newY = mazeCat.y;

    if (direction === 'up') newY -= 1;
    if (direction === 'down') newY += 1;
    if (direction === 'left') newX -= 1;
    if (direction === 'right') newX += 1;

    const grid = puzzle.data.grid;
    const size = puzzle.data.size;

    // Check boundaries and wall hits
    if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
      const tile = grid[newY][newX];
      if (tile !== 'wall') {
        const nextPos = { x: newX, y: newY };
        setMazeCat(nextPos);
        
        // Check goal match
        if (newX === puzzle.data.targetPos.x && newY === puzzle.data.targetPos.y) {
          sfx.playSuccess();
          setIsAnswered(true);
          setIsCorrect(true);
          updateGuideCharacterReaction(true);
        }
      } else {
        // wall hit feedback buzzer
        sfx.playFail();
      }
    } else {
      sfx.playFail();
    }
  };

  // --- HIDDEN ODD FINDER GRID ---
  const handleHiddenSpotTap = (idx: number) => {
    if (isAnswered) return;
    
    setFlippedHiddenIdx([...flippedHiddenIdx, idx]);

    if (idx === puzzle.correctAnswer) {
      sfx.playSuccess();
      setIsAnswered(true);
      setIsCorrect(true);
      updateGuideCharacterReaction(true);
    } else {
      sfx.playFail();
      setAttempts(prev => prev + 1);
      updateGuideCharacterReaction(false);
    }
  };

  // Handle Using Hint
  const handleRequestHint = () => {
    if (hintsCount > 0 && !showHintMsg) {
      sfx.playTap();
      setShowHintMsg(true);
      onUseHint();
    }
  };

  // Finish Level and return stars and coins
  const handleFinishAndReward = () => {
    // Stars calculation: less mistakes = more stars
    let earnedStars = puzzle.rewardStars;
    if (attempts > 3 && earnedStars > 1) earnedStars -= 1;
    
    onPuzzleSuccess(earnedStars, puzzle.rewardCoins);
  };

  // Format World Headers
  const getWorldLabel = () => {
    switch (worldId) {
      case WorldId.Math: return 'عالم الرياضيات والأرقام 🧮';
      case WorldId.Memory: return 'عالم الذاكرة والحفظ 🧠';
      case WorldId.Colors: return 'عالم الألوان الساحر 🎨';
      case WorldId.Words: return 'عالم الحروف والكلمات ✍️';
      case WorldId.Mazes: return 'عالم المتاهات والمسارات 🧭';
      case WorldId.Secret: return 'عالم الغرف السرية والأقفال 🔑';
      case WorldId.Logic: return 'عالم الذكاء والمنطق العبقري 🧠';
      case WorldId.Hidden: return 'عالم الصورة المخفية والعدسات 🔍';
      default: return 'مدينة الألغاز الذكية';
    }
  };

  return (
    <div id="puzzle-player-component" className="w-full max-w-2xl mx-auto space-y-6 text-right pb-10">
      {/* Top Controller Row */}
      <div className="flex justify-between items-center bg-white soft-card-shadow px-4 py-3 rounded-2.5xl border-3 border-orange-200">
        <button
          id="back-to-map-btn"
          onClick={onBackToMap}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-xs transition-all active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>خريطة العوالم</span>
        </button>

        <div className="text-center">
          <h2 className="text-sm font-black text-orange-600 truncate">{getWorldLabel()}</h2>
          <span className="text-[10px] bg-slate-100 px-3 py-0.5 rounded-full font-bold text-slate-500">
            لغز رقم: {levelNumber} 🏆
          </span>
        </div>

        {/* Dynamic Hints indicator */}
        <button
          id="puzzle-hint-btn"
          onClick={handleRequestHint}
          disabled={hintsCount === 0 || showHintMsg}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs border-b-3 transition-all ${
            hintsCount > 0 && !showHintMsg
              ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-yellow-600 active:translate-y-0.5'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          <Lightbulb size={14} className={hintsCount > 0 ? "animate-pulse" : ""} />
          <span>مساعد ذكي ({hintsCount})</span>
        </button>
      </div>

      {/* Guide Character Bubble */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-4 rounded-3xl border-3 border-white soft-card-shadow text-white flex gap-4 items-center flex-row-reverse relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bg-white/10 w-24 h-24 rounded-full translate-x-10 -translate-y-10"></div>
        
        {/* Cute animated graphic guide preview based on level seed */}
        <div className="text-4.5xl animate-kids-bounce shrink-0 relative z-10 filter drop-shadow">
          {levelNumber % 4 === 1 ? '🐱' : levelNumber % 4 === 2 ? '🤖' : levelNumber % 4 === 3 ? '🐦' : '🦁'}
        </div>
        
        <div className="space-y-1 relative z-10 leading-snug">
          <span className="text-[10px] font-black tracking-wide block text-yellow-100">مرشد مدينة الألغاز يهمس لك:</span>
          <p className="font-extrabold text-xs sm:text-sm drop-shadow-sm">{guidePhrase}</p>
        </div>
      </div>

      {/* Primary Interactive Board */}
      <div className="bg-white soft-card-shadow border-4 border-orange-200 rounded-3.5xl p-6 min-h-[300px] flex flex-col justify-center relative">
        
        {/* Success overlay screen */}
        {isAnswered && (
          <div className="absolute inset-0 bg-white/95 rounded-3xl z-40 flex flex-col items-center justify-center p-6 text-center animate-[pop-in_0.4s_ease]">
            <div className="text-6xl animate-bounce mb-3">🎉🏆⭐</div>
            <h3 className="text-2xl font-black text-green-600 mb-2">إجابة مذهلة وصحيحة!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              أنت عبقري بحق! لقد تجاوزت هذا المستوى بكل جدارة وذكاء وكسبت نقاط إضافية! هل أنت مستعد للغز القادم؟
            </p>

            {/* Awards details panel */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-amber-100 text-amber-800 border-2 border-amber-300 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1 shadow-sm">
                <Coins size={16} className="text-amber-600" />
                <span>+ {puzzle.rewardCoins} عملة</span>
              </div>
              <div className="bg-indigo-100 text-indigo-800 border-2 border-indigo-300 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1 shadow-sm">
                <Star size={16} className="text-indigo-600" />
                <span>+ {attempts <= 3 ? puzzle.rewardStars : puzzle.rewardStars - 1} نجوم</span>
              </div>
            </div>

            <button
              id="confirm-reward-next-btn"
              onClick={handleFinishAndReward}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-2.5xl border-b-4 border-green-700 hover:scale-105 active:translate-y-1 transition-all flex items-center gap-1 text-base shadow-md"
            >
              <span>تابع اللعب والمكافأة</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Level prompt */}
        <div className="text-center mb-6">
          <h3 className="text-base sm:text-lg font-black text-slate-800 leading-normal">{puzzle.instruction}</h3>
        </div>

        {/* RENDER FOR WORK MATH WORLD */}
        {puzzle.worldId === WorldId.Math && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* 1. Visual Addition fruits puzzle */}
            {puzzle.data.type === 'visual_addition' && (
              <div className="bg-amber-50 hover:bg-amber-100/40 p-6 rounded-3xl border-3 border-dashed border-amber-200 text-center text-4xl leading-[1.6]">
                <div className="font-mono tracking-widest text-[#ef4444] drop-shadow-sm font-bold">
                  {puzzle.data.visuals}
                </div>
              </div>
            )}

            {/* 2. Multiple Scales Equations */}
            {puzzle.data.type === 'fruit_logic' && (
              <div className="space-y-2">
                <div className="text-center text-xs font-bold text-[#854d0e] mb-1">المعادلات السحرية المكتشفة:</div>
                <div className="grid grid-cols-2 gap-2">
                  {puzzle.data.equations.map((eq: string, idx: number) => (
                    <div key={idx} className="bg-yellow-50/50 border border-yellow-200 p-2 text-center text-lg font-black rounded-2xl text-yellow-900">
                      {eq}
                    </div>
                  ))}
                </div>
                {/* Target equation centered */}
                <div className="bg-amber-100/40 border-2 border-amber-300 p-4 rounded-2.5xl text-center text-2xl font-black text-amber-900 mt-2">
                  {puzzle.data.target}
                </div>
              </div>
            )}

            {/* 3. Missing operators or numbers equations */}
            {(puzzle.data.type === 'operator' || puzzle.data.type === 'missing_number') && (
              <div className="bg-indigo-50/50 py-6 px-4 rounded-3xl border-3 border-dashed border-indigo-100 text-center text-3xl font-black text-indigo-900">
                {puzzle.data.equation}
              </div>
            )}

            {/* Choices Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
              {puzzle.data.choices.map((choice: any, idx: number) => {
                const isSelected = selectedChoice === choice;
                return (
                  <button
                    id={`choice-btn-${idx}`}
                    key={idx}
                    onClick={() => handleGeneralChoiceSubmit(choice)}
                    className={`py-3 px-4 rounded-2.5xl font-black border-b-6 text-xl transition-all ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-700'
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-850 border-orange-300 active:translate-y-1'
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RENDER FOR MEMORY CARD PAIRS */}
        {puzzle.worldId === WorldId.Memory && (
          <div className="flex-1 flex flex-col justify-center">
            <div className={`grid gap-3 max-w-md mx-auto w-full justify-center ${
              puzzle.data.pairsCount === 2 ? 'grid-cols-2' : 
              puzzle.data.pairsCount === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {memoryCards.map((card, idx) => {
                const showContent = card.isFlipped || card.isMatched;
                return (
                  <button
                    id={`mem-card-${idx}`}
                    key={card.id}
                    onClick={() => handleMemoryCardTap(idx)}
                    className={`h-20 w-20 sm:h-24 sm:w-24 rounded-3xl border-3 text-4xl text-center flex items-center justify-center transition-all select-none font-bold cursor-pointer border-b-6 active:translate-y-1 ${
                      card.isMatched
                        ? 'bg-green-100 border-green-300 scale-95 opacity-80 cursor-default'
                        : showContent
                        ? 'bg-yellow-50 border-yellow-300 animate-[pop-in_0.2s_ease]'
                        : 'bg-indigo-400 hover:bg-indigo-500 text-white border-indigo-600'
                    }`}
                  >
                    {showContent ? card.icon : '❓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RENDER FOR COLORS MIX LAB */}
        {puzzle.worldId === WorldId.Colors && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Mixing beakers visual display */}
            {puzzle.data.type === 'color_blend' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-6 py-2">
                  <div className="text-5xl animate-[hover-bounce_2.5s_infinite_ease-out] relative">
                    🧪
                    {chosenMixColors[0] && (
                      <span className="absolute -top-1 -right-1 text-xs">{chosenMixColors[0].split(' ')[0]}</span>
                    )}
                  </div>
                  <span className="text-xl font-black text-slate-400">+</span>
                  <div className="text-5xl animate-[hover-bounce_2s_infinite_ease-out] relative">
                    🧪
                    {chosenMixColors[1] && (
                      <span className="absolute -top-1 -right-1 text-xs">{chosenMixColors[1].split(' ')[0]}</span>
                    )}
                  </div>
                </div>

                {/* Mixing instructions & choices */}
                <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                  {puzzle.data.choices.map((color: string, idx: number) => {
                    const isSelected = chosenMixColors.includes(color);
                    return (
                      <button
                        id={`blend-color-btn-${idx}`}
                        key={idx}
                        onClick={() => handleColorBlendSelection(color)}
                        className={`py-2 px-3 rounded-2xl font-bold border-b-4 text-xs transition-all ${
                          isSelected
                            ? 'bg-indigo-500 text-white border-indigo-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 active:translate-y-1'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>

                <button
                  id="mix-chemistry-btn"
                  onClick={handleMixColorsSubmit}
                  disabled={chosenMixColors.length < 2}
                  className={`px-8 py-2.5 rounded-2xl font-black text-sm border-b-4 transition-all w-full max-w-xs mx-auto ${
                    chosenMixColors.length === 2
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800'
                      : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}
                >
                  خلط وتركيب كيميائي 🪄
                </button>
              </div>
            )}

            {/* Pattern completion balloon rows */}
            {puzzle.data.type === 'color_pattern' && (
              <div className="text-center space-y-6">
                <div className="flex justify-center items-center gap-1 bg-sky-50 p-4 border border-sky-100 rounded-3xl overflow-hidden">
                  {puzzle.data.sequence.map((color: string, idx: number) => (
                    <span key={idx} className="text-4xl animate-kids-bounce filter drop-shadow hover:scale-110 select-none cursor-help" style={{ animationDelay: `${idx * 0.15}s` }}>
                      {color}
                    </span>
                  ))}
                  <span className="text-4xl font-black font-sans mx-2 text-sky-400 animate-pulse">❓</span>
                </div>

                {/* Choices list */}
                <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto">
                  {puzzle.data.choices.map((color: string, idx: number) => (
                    <button
                      id={`pattern-choice-btn-${idx}`}
                      key={idx}
                      onClick={() => handleGeneralChoiceSubmit(color)}
                      className="text-3xl p-2 bg-yellow-50 hover:bg-yellow-100 border-b-4 border-yellow-200 rounded-2.5xl transition-all hover:scale-110 active:translate-y-0.5"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RENDER FOR LETTERS & WORDS builder speller */}
        {puzzle.worldId === WorldId.Words && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Target interactive card */}
            <div className="bg-sky-50 hover:bg-sky-100/40 border border-sky-200 p-4 rounded-3xl text-center flex flex-col items-center">
              <span className="text-6xl mb-2 filter drop-shadow animate-kids-bounce">{puzzle.data.emoji}</span>
              <p className="text-xs font-semibold text-sky-800">تلميح اللغز: "{puzzle.data.hintText}"</p>
            </div>

            {/* Built spelling block */}
            <div className="min-h-12 border-3 border-dashed border-indigo-200 p-4 rounded-2.5xl flex items-center justify-center gap-2 flex-row-reverse">
              {builtSpelling.length === 0 ? (
                <span className="text-xs text-slate-400 font-bold">ضع الحروف بالضغط عليها بالترتيب هنا...</span>
              ) : (
                builtSpelling.map((char, index) => (
                  <button
                    id={`built-char-${index}`}
                    key={index}
                    onClick={() => handleWordTileTap(char, index, true)}
                    className="w-12 h-12 bg-indigo-500 font-black text-xl text-white rounded-xl flex items-center justify-center border-b-4 border-indigo-700 cursor-pointer hover:bg-red-400 hover:border-red-600 transition-all shadow"
                  >
                    {char}
                  </button>
                ))
              )}
            </div>

            {/* Scrambled remaining letter bank */}
            <div className="flex justify-center gap-2 flex-row-reverse">
              {remainingLetters.map((char, index) => (
                <button
                  id={`remaining-char-${index}`}
                  key={index}
                  onClick={() => handleWordTileTap(char, index, false)}
                  className="w-12 h-12 bg-amber-100 font-black text-xl text-amber-900 rounded-xl flex items-center justify-center border-b-4 border-amber-300 cursor-pointer hover:bg-amber-200 transition-all shadow"
                >
                  {char}
                </button>
              ))}
            </div>

            <button
              id="verify-spelling-btn"
              onClick={handleVerifySpelling}
              disabled={builtSpelling.length === 0}
              className={`py-2.5 px-6 rounded-2xl font-black text-sm border-b-4 transition-all w-full max-w-xs mx-auto ${
                builtSpelling.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800'
                  : 'bg-slate-200 text-slate-400 border-slate-300'
              }`}
            >
              تحقق من صحة الكلمة 🪄
            </button>
          </div>
        )}

        {/* RENDER FOR MAZE GRIDS ESCAPE */}
        {puzzle.worldId === WorldId.Mazes && (
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* The live Maze board */}
            <div className="bg-amber-100/50 p-3 rounded-2.5xl border-3 border-amber-200 max-w-xs sm:max-w-sm mx-auto w-full overflow-hidden shadow-inner">
              <div 
                className="grid gap-1 mx-auto" 
                style={{ 
                  gridTemplateColumns: `repeat(${puzzle.data.size}, minmax(0, 1fr))` 
                }}
              >
                {puzzle.data.grid.map((rowArr: string[], rIdx: number) => 
                  rowArr.map((tile: string, cIdx: number) => {
                    const isCatHere = mazeCat.x === cIdx && mazeCat.y === rIdx;
                    return (
                      <div
                        key={`${rIdx}_${cIdx}`}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold select-none ${
                          isCatHere 
                            ? 'bg-yellow-200 border border-yellow-300 animate-[hover-bounce_1.5s_infinite_ease-out]'
                            : tile === 'wall'
                            ? 'bg-amber-800 border-b-4 border-amber-950 text-white'
                            : tile === 'goal'
                            ? 'bg-emerald-100 border border-emerald-300 animate-pulse'
                            : 'bg-[#ffedd5]'
                        }`}
                      >
                        {isCatHere ? '🐱' : tile === 'wall' ? '🧱' : tile === 'goal' ? '🐟' : ''}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Maze steering D-Pad arrows */}
            <div className="max-w-xs mx-auto w-full flex flex-col items-center select-none gap-2">
              <button
                id="maze-up-btn"
                onClick={() => handleMazeMove('up')}
                className="w-12 h-12 bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 text-white rounded-xl font-bold flex items-center justify-center shadow"
              >
                ⬆️
              </button>
              <div className="flex gap-4">
                <button
                  id="maze-left-btn"
                  onClick={() => handleMazeMove('left')}
                  className="w-12 h-12 bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 text-white rounded-xl font-bold flex items-center justify-center shadow"
                >
                  ⬅️
                </button>
                <div className="w-12"></div> {/* spacer */}
                <button
                  id="maze-right-btn"
                  onClick={() => handleMazeMove('right')}
                  className="w-12 h-12 bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 text-white rounded-xl font-bold flex items-center justify-center shadow"
                >
                  ➡️
                </button>
              </div>
              <button
                id="maze-down-btn"
                onClick={() => handleMazeMove('down')}
                className="w-12 h-12 bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 text-white rounded-xl font-bold flex items-center justify-center shadow"
              >
                ⬇️
              </button>
            </div>
          </div>
        )}

        {/* RENDER FOR SECRET ROOM RIDDLES & CODES */}
        {puzzle.worldId === WorldId.Secret && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Scroll of lock questions */}
            <div className="bg-amber-50 rounded-3xl p-6 border-3 border-dashed border-amber-300 text-center relative overflow-hidden flex flex-col items-center">
              <div className="text-5xl animate-bounce mb-2">📜🗝️</div>
              <p className="text-sm font-black text-[#7c2d12] leading-relaxed max-w-md">
                "{puzzle.data.questionText}"
              </p>
            </div>

            {/* Choices Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
              {puzzle.data.choices.map((choice: any, idx: number) => {
                const isSelected = selectedChoice === choice;
                return (
                  <button
                    id={`riddle-choice-btn-${idx}`}
                    key={idx}
                    onClick={() => handleGeneralChoiceSubmit(choice)}
                    className={`py-2.5 px-4 rounded-2xl font-black border-b-4 text-xs sm:text-sm transition-all text-right flex items-center justify-end gap-2 ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-700'
                        : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-905 border-yellow-300 active:translate-y-0.5'
                    }`}
                  >
                    <span>{choice}</span>
                    <span className="text-amber-600">🔑</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RENDER FOR LOGIC & SEQUENCES */}
        {puzzle.worldId === WorldId.Logic && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* 1. If shape sequence loop */}
            {puzzle.data.type === 'shape_sequence' && (
              <div className="bg-sky-50 rounded-3xl p-4 border border-sky-100 flex items-center justify-center gap-1 overflow-hidden">
                {puzzle.data.sequence.map((item: string, idx: number) => (
                  <span key={idx} className="text-4xl filter drop-shadow animate-kids-bounce" style={{ animationDelay: `${idx * 0.15}s` }}>{item}</span>
                ))}
                <span className="text-4xl font-sans font-black text-sky-450 ml-1 animate-pulse">❓</span>
              </div>
            )}

            {/* 2. Weight logic scale */}
            {puzzle.data.type === 'scale_logic' && (
              <div className="bg-amber-50/50 p-6 rounded-3xl border-3 border-dashed border-amber-200 text-center flex flex-col items-center">
                <div className="text-5xl mb-2 filter drop-shadow">⚖️</div>
                <p className="text-xs sm:text-sm font-black text-amber-900 leading-relaxed max-w-md">
                  "{puzzle.data.puzzleText}"
                </p>
              </div>
            )}

            {/* Choices logic */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full">
              {puzzle.data.choices.map((choice: any, idx: number) => {
                const isSelected = selectedChoice === choice;
                return (
                  <button
                    id={`logic-choice-btn-${idx}`}
                    key={idx}
                    onClick={() => handleGeneralChoiceSubmit(choice)}
                    className={`py-3 px-2 rounded-2.5xl font-black border-b-6 text-xs sm:text-sm transition-all truncate text-center ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-700'
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-900 border-orange-300 active:translate-y-1'
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RENDER FOR HIDDEN OBJECTS ODD ONE OUT */}
        {puzzle.worldId === WorldId.Hidden && (
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {/* 1. Find Odd One Out Grid */}
            {puzzle.data.type === 'find_odd' && (
              <div 
                className="grid gap-2 max-w-xs sm:max-w-sm mx-auto w-full justify-center"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.data.cols}, minmax(0, 1fr))`
                }}
              >
                {puzzle.data.gridItems.map((item: string, idx: number) => {
                  const wasFlipped = flippedHiddenIdx.includes(idx);
                  return (
                    <button
                      id={`odd-item-btn-${idx}`}
                      key={idx}
                      onClick={() => handleHiddenSpotTap(idx)}
                      className={`h-11 w-11 sm:h-14 sm:w-14 text-2xl sm:text-3xl rounded-xl flex items-center justify-center font-bold transition-all border border-slate-200 hover:scale-110 active:scale-90 ${
                        wasFlipped
                          ? idx === puzzle.correctAnswer
                            ? 'bg-green-100 border-green-400 border-2'
                            : 'bg-red-50 border-red-300 scale-90 opacity-70'
                          : 'bg-[#fafafa] hover:bg-yellow-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Hidden environmental items lists */}
            {puzzle.data.type === 'find_hidden_target' && (
              <div className="text-center space-y-4">
                <div className="bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] py-3 px-4 rounded-2.5xl font-bold text-xs inline-block">
                  ميدان البحث: <span className="text-[#0284c7] font-black">{puzzle.data.envTitle}</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-3xl">
                  {puzzle.data.elements.map((item: string, idx: number) => (
                    <button
                      id={`hidden-target-btn-${idx}`}
                      key={idx}
                      onClick={() => handleGeneralChoiceSubmit(item)}
                      className="text-4xl p-2 bg-white hover:bg-yellow-50 rounded-xl transition-all border border-slate-100 hover:scale-115 active:scale-95 shadow-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Interactive Helper Text Message when Hint Button clicked */}
      {showHintMsg && (
        <div className="bg-yellow-50 p-4 rounded-3xl border-3 border-yellow-300 soft-card-shadow text-right text-[#854d0e] flex gap-2 items-start justify-end flex-row-reverse animate-[pop-in_0.3s_ease]">
          <Lightbulb size={18} className="shrink-0 text-yellow-600 mt-1" />
          <div className="space-y-1">
            <span className="text-[10px] font-bold block text-yellow-700">تلميح عبقري مجاني:</span>
            <p className="text-xs font-black leading-relaxed">{puzzle.hint}</p>
          </div>
        </div>
      )}
    </div>
  );
}
