/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorldId, PuzzleQuestion, Difficulty } from '../types';

// Emoji sets for dynamic generation
const ANIMALS = ['🦁', '🐼', '🦊', '🐰', '🐨', '🦄', '🦖', '🐝', '🐙', '🐸', '🐵', '🐱', '🐶', '🦄', '🦉'];
const FRUITS = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍍', '🍇', '🍉', '🥝', '🥑', '🍋', '🍑'];
const VEHICLES = ['🚗', '✈️', '🚀', '🚢', '🚂', '🚁', '🚕', '🚜', '🚲', '🚒'];
const TOYS = ['🎈', '🎨', '🧸', '🎮', '🧩', '🎸', '🎺', '🛹', '🎪', '🏰'];

// Standard list of animals for spelling
const WORD_DB = [
  { word: 'أسد', emoji: '🦁', hint: 'ملك الغابة القوي' },
  { word: 'قرد', emoji: '🐒', hint: 'يحب أكل الموز والتسلق' },
  { word: 'قطة', emoji: '🐱', hint: 'حيوان أليف يقول مياو' },
  { word: 'موز', emoji: '🍌', hint: 'فاكهة صفراء مفضلة للقردة' },
  { word: 'أرنب', emoji: '🐰', hint: 'حيوان يقفز سريعاً ويحب الجزر' },
  { word: 'نمر', emoji: '🐯', hint: 'حيوان مفترس لديه خطوط سوداء' },
  { word: 'تفاحة', emoji: '🍎', hint: 'فاكهة لذيذة ومفيدة حمراء' },
  { word: 'عصفور', emoji: '🐦', hint: 'طائر صغير يغرد في الصباح' },
  { word: 'روبوت', emoji: '🤖', hint: 'مساعد ذكي مصنوع من الحديد' },
  { word: 'سيارة', emoji: '🚗', hint: 'نركبها لنتنقل في الشوارع' },
  { word: 'طائرة', emoji: '✈️', hint: 'تطير في السماء بين الغيوم' },
  { word: 'كتاب', emoji: '📚', hint: 'نقرأ فيه قصصاً مفيدة وعجيبة' },
  { word: 'نجمة', emoji: '⭐', hint: 'تلمع في السماء ليلاً' },
  { word: 'فيل', emoji: '🐘', hint: 'حيوان ضخم جداً ولديه خرطوم طويل' },
];

// Riddles for Secret Rooms
const RIDDLES = [
  { q: 'أنا شيء أطير في السماء بلا جناحين، وأبكي بلا عينين.. فمن أنا؟', options: ['العصفور 🐦', 'الغيمة ☁️', 'الطائرة ✈️', 'البالون 🎈'], correct: 'الغيمة ☁️', hint: 'أمطر ماءً عذباً على الأرض' },
  { q: 'أنا شيء لدي أسنان كثيرة لكنني لا أعض أحداً.. فمن أنا؟', options: ['المشط 🪮', 'الأسد 🦁', 'الروبوت 🤖', 'المفتاح 🔑'], correct: 'المشط 🪮', hint: 'نستخدمه لترتيب شعرنا الجميل' },
  { q: 'أنا بيت ليس لدي أبواب ولا نوافذ، وداخلي كنز أصفر.. فمن أنا؟', options: ['القلعة 🏰', 'الخلية 🐝', 'البيضة 🥚', 'الصندوق 📦'], correct: 'البيضة 🥚', hint: 'تفقس منها الكتاكيت الصغيرة' },
  { q: 'أنا شيء يقرأ ويكتب لكنه لا يتكلم أبداً.. فمن أنا؟', options: ['الكتاب 📖', 'القلم ✏️', 'اللوح  whiteboard', 'الهاتف 📱'], correct: 'الكتاب 📖', hint: 'تجدني في المكتبة المدرسية' },
  { q: 'أكبر حيوان يعيش في المحيطات، يسبح بمهارة ويرش من ظهره ماء.. من أنا؟', options: ['القرش 🦈', 'الدلفين 🐬', 'الحوت الأزرق 🐋', 'الأخطبوط 🐙'], correct: 'الحوت الأزرق 🐋', hint: 'هو أضخم كائن على كوكب الأرض' },
];

export function getPuzzle(worldId: WorldId, levelNumber: number): PuzzleQuestion {
  // We compute deterministic variables based on levelNumber so that levels 1 to 100 are generated procedurally
  const seed = levelNumber * 7 + worldId.charCodeAt(0);
  const difficulty = levelNumber <= 3 ? Difficulty.Easy : levelNumber <= 7 ? Difficulty.Medium : Difficulty.Hard;

  switch (worldId) {
    case WorldId.Math:
      return generateMathPuzzle(levelNumber, seed, difficulty);

    case WorldId.Memory:
      return generateMemoryPuzzle(levelNumber, seed, difficulty);

    case WorldId.Colors:
      return generateColorsPuzzle(levelNumber, seed, difficulty);

    case WorldId.Words:
      return generateWordsPuzzle(levelNumber, seed, difficulty);

    case WorldId.Mazes:
      return generateMazesPuzzle(levelNumber, seed, difficulty);

    case WorldId.Secret:
      return generateSecretPuzzle(levelNumber, seed, difficulty);

    case WorldId.Logic:
      return generateLogicPuzzle(levelNumber, seed, difficulty);

    case WorldId.Hidden:
    default:
      return generateHiddenPuzzle(levelNumber, seed, difficulty);
  }
}

// 1. Math Puzzle Builder
function generateMathPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  const isBoss = level % 10 === 0;
  
  if (isBoss) {
    // Elegant system of equation with cute fruits
    const valA = 2 + (seed % 4); // strawberry
    const valB = 1 + (seed % 3); // banana
    const aEmoji = '🍓';
    const bEmoji = '🍌';
    const totalA = valA + valA;
    const totalB = valA + valB;
    const finalEquationText = `${aEmoji} + ${bEmoji} = ؟`;

    return {
      id: level,
      worldId: WorldId.Math,
      levelNumber: level,
      instruction: `تحدي الزعيم! اكتشف قيمة الفاكهة واحل اللغز:`,
      data: {
        type: 'fruit_logic',
        equations: [
          `${aEmoji} + ${aEmoji} = ${totalA}`,
          `${aEmoji} + ${bEmoji} = ${totalB}`
        ],
        target: finalEquationText,
        choices: [valA + valB, valA * valB, valA + valB + 2, valA - valB].sort(() => Math.random() - 0.5)
      },
      correctAnswer: valA + valB,
      hint: `الفراولة الواحدة ${aEmoji} قيمتها ${valA}. والموزة الواحدة ${bEmoji} كم تساوي؟`,
      rewardCoins: 50,
      rewardStars: 3
    };
  }

  // Regular level equations (fruit additions / scales)
  if (level <= 3) {
    const num1 = 1 + (seed % 4);
    const num2 = 1 + ((seed + 2) % 4);
    const fruit = seed % 2 === 0 ? '🍎' : '🍊';
    const f1Str = Array(num1).fill(fruit).join('');
    const f2Str = Array(num2).fill(fruit).join('');
    
    return {
      id: level,
      worldId: WorldId.Math,
      levelNumber: level,
      instruction: `عد الفواكه الجميلة واجمعها معاً:`,
      data: {
        type: 'visual_addition',
        visuals: `${f1Str} + ${f2Str}`,
        choices: [num1 + num2, num1 + num2 - 1, num1 + num2 + 1, num1 + num2 + 2].filter((v, i, self) => self.indexOf(v) === i && v > 0).slice(0, 4)
      },
      correctAnswer: num1 + num2,
      hint: `قم بعدّ الحبات في الكومة الأولى (${num1}) ثم الكومة الثانية (${num2}) واجمعهما.`,
      rewardCoins: 20,
      rewardStars: 1
    };
  } else {
    // Fill the missing operator or balances
    const isOperatorChallenge = level % 2 === 0;
    if (isOperatorChallenge) {
      const ops = ['+', '-'];
      const chosenOp = ops[seed % 2];
      const val1 = 5 + (seed % 8);
      const val2 = 1 + (seed % 4);
      const ans = chosenOp === '+' ? val1 + val2 : val1 - val2;
      
      return {
        id: level,
        worldId: WorldId.Math,
        levelNumber: level,
        instruction: `ما الرمز الصحيح الذي يجب وضعه في الفراغ ليصبح الحساب صحيحاً؟`,
        data: {
          type: 'operator',
          equation: `${val1} [ ؟ ] ${val2} = ${ans}`,
          choices: ['+', '-', '×', '÷']
        },
        correctAnswer: chosenOp,
        hint: `جرب وضع كل رمز بيدك: هل ${val1} زائد ${val2} يساوي ${ans} أم ناقص؟`,
        rewardCoins: 30,
        rewardStars: 2
      };
    } else {
      // Missing digit algebra
      const val1 = 4 + (seed % 10);
      const ans = 10 + (seed % 10);
      const missing = ans - val1;
      
      return {
        id: level,
        worldId: WorldId.Math,
        levelNumber: level,
        instruction: `الميزان السحري متعادل! أوجد الرقم المفقود ليصبح الطرفان متساويين:`,
        data: {
          type: 'missing_number',
          equation: `${val1} +  ؟  = ${ans}`,
          choices: [missing, missing + 2, missing - 1, missing + 1].filter(v => v >= 0).slice(0, 4)
        },
        correctAnswer: missing,
        hint: `كم يتبقى لكي يصل الرقم ${val1} إلى الرقم ${ans}؟ اطرح ${val1} من ${ans}.`,
        rewardCoins: 35,
        rewardStars: 2
      };
    }
  }
}

// 2. Memory Puzzle matching cards
function generateMemoryPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  // Determine card count based on level
  let pairsCount = 2; // 4 cards
  if (level > 2) pairsCount = 3;  // 6 cards
  if (level > 5) pairsCount = 4;  // 8 cards
  if (level > 8) pairsCount = 6;  // 12 cards

  // Pick pairs count items from dynamic catalogs
  const iconsPool = seed % 3 === 0 ? ANIMALS : seed % 3 === 1 ? FRUITS : VEHICLES;
  const pickedIcons: string[] = [];
  const localPool = [...iconsPool];
  
  for (let i = 0; i < pairsCount; i++) {
    const idx = (seed + i * 5) % localPool.length;
    pickedIcons.push(localPool[idx]);
    localPool.splice(idx, 1);
  }

  // Build the deck of double images, randomized
  const cards = [...pickedIcons, ...pickedIcons].map((icon, idx) => ({
    id: idx,
    icon,
    isFlipped: false,
    isMatched: false
  }));

  // Simple pseudo-random shuffle using seed
  for (let i = cards.length - 1; i > 0; i--) {
    const j = (seed * (i + 13)) % cards.length;
    const temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }

  return {
    id: level,
    worldId: WorldId.Memory,
    levelNumber: level,
    instruction: `تحدي الذاكرة القوية! طابق الزوج المتماثل من كروت اللعب بالضغط عليها:`,
    data: {
      type: 'card_matching',
      cards,
      pairsCount
    },
    correctAnswer: pairsCount, // Trigger victory when total pairs matched == pairsCount
    hint: `اضغط على الكروت برفق واحفظ مكان الحيوان أو الفاكهة في رأسك لكي تجد توأمه بسهولة!`,
    rewardCoins: 25 + level * 2,
    rewardStars: level % 3 === 0 ? 3 : 2
  };
}

// 3. Color Sorting/Blends mixing
function generateColorsPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  const isBlendChallenge = level % 2 === 1;

  if (isBlendChallenge) {
    const blends = [
      { c1: 'أحمر 🔴', c2: 'أصفر 🟡', outName: 'البرتقالي 🟠', result: 'برتقالي' },
      { c1: 'أزرق 🔵', c2: 'أصفر 🟡', outName: 'الأخضر 🟢', result: 'أخضر' },
      { c1: 'أحمر 🔴', c2: 'أزرق 🔵', outName: 'البنفسجي 🟣', result: 'بنفسجي' },
      { c1: 'أحمر 🔴', c2: 'أبيض ⚪', outName: 'الوردي 🌸', result: 'وردي' },
      { c1: 'أسود ⚫', c2: 'أبيض ⚪', outName: 'الرمادي 🪙', result: 'رمادي' }
    ];
    const picked = blends[seed % blends.length];
    
    return {
      id: level,
      worldId: WorldId.Colors,
      levelNumber: level,
      instruction: `مخترع الألوان! اختر السائلين اللذين يجب خلطهما في المخبر السحري لتركيب اللون ${picked.outName}؟`,
      data: {
        type: 'color_blend',
        targetColor: picked.outName,
        choices: ['🔴 أحمر', '🟡 أصفر', '🔵 أزرق', '⚪ أبيض', '⚫ أسود', '🟢 أخضر'],
        correctPair: [picked.c1.split(' ')[0], picked.c2.split(' ')[0]] // E.g. ['أحمر', 'أصفر']
      },
      correctAnswer: picked.result,
      hint: `فكر بخلط الألوان الأساسية: لتركيب ${picked.outName}، اخلط ${picked.c1} مع لون سحري آخر!`,
      rewardCoins: 30,
      rewardStars: 2
    };
  } else {
    // Color pattern completion
    const patternTypes = [
      { sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], next: '🔵', text: 'أحمر، أزرق، أحمر، أزرق' },
      { sequence: ['🟢', '🟡', '🟡', '🟢', '🟡', '🟡', '🟢'], next: '🟡', text: 'أخضر، أصفر، أصفر، أخضر..' },
      { sequence: ['🟣', '🟣', '🟠', '🟣', '🟣'], next: '🟠', text: 'بنفسجي، بنفسجي، برتقالي، بنفسجي، بنفسجي' },
      { sequence: ['🔴', '🟢', '🔵', '🔴', '🟢'], next: '🔵', text: 'أحمر، أخضر، أزرق، أحمر، أخضر' }
    ];
    const pickedPattern = patternTypes[seed % patternTypes.length];
    return {
      id: level,
      worldId: WorldId.Colors,
      levelNumber: level,
      instruction: `اكتشف نمط الألوان الذكية واختر لون الكرة المفقودة لتكمل النبض بانتظام:`,
      data: {
        type: 'color_pattern',
        sequence: pickedPattern.sequence,
        choices: ['🔴', '🔵', '🟡', '🟢', '🟠', '🟣']
      },
      correctAnswer: pickedPattern.next,
      hint: `انظر إلى تكرار الكرات الملونة: النمط مكرر بانتظام. ما الذي يأتي بعد السلسلة؟`,
      rewardCoins: 25,
      rewardStars: 1
    };
  }
}

// 4. Letters & Words spelling
function generateWordsPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  // Pick word based on seed
  const item = WORD_DB[seed % WORD_DB.length];
  const arrLetters = item.word.split('');
  
  // Scramble letters
  const scrambled = [...arrLetters];
  for (let i = scrambled.length - 1; i > 0; i--) {
    const j = (seed * (i + 3)) % scrambled.length;
    const temp = scrambled[i];
    scrambled[i] = scrambled[j];
    scrambled[j] = temp;
  }

  return {
    id: level,
    worldId: WorldId.Words,
    levelNumber: level,
    instruction: `لنرتب الحروف الضائعة! اضغط على الحروف بالترتيب الصحيح لتكوين اسم هذا الشيء:`,
    data: {
      type: 'word_builder',
      emoji: item.emoji,
      scrambled,
      letters: arrLetters,
      hintText: item.hint
    },
    correctAnswer: item.word,
    hint: `تلميح: اسم هذا الكائن هو "${item.word}". ابدأ بالحرف الأول (${arrLetters[0]}) ثم الذي يليه!`,
    rewardCoins: 40,
    rewardStars: 2
  };
}

// 5. Maze puzzle creation
function generateMazesPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  // Size of maze scales slightly with level
  const size = level <= 3 ? 5 : level <= 7 ? 6 : 7;
  
  // Build standard grid of 'path', 'wall', 'start', 'goal'
  const grid: string[][] = [];
  for (let r = 0; r < size; r++) {
    grid.push(new Array(size).fill('path'));
  }

  // Pre-seed simple walls so there's always a solid path
  // Kids need easy but real mazes
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Create a wavy wall pattern leaving paths
      if (r % 2 === 1 && c > 0 && c < size - 1 && seed % 3 !== 0) {
        grid[r][c] = 'wall';
      }
      if (c % 2 === 1 && r > 0 && r < size - 1 && (seed + r) % 4 === 1) {
        grid[r][c] = 'wall';
      }
    }
  }

  // Start position and goal position
  const startX = 0;
  const startY = 0;
  const goalX = size - 1;
  const goalY = size - 1;
  
  grid[startY][startX] = 'start';
  grid[goalY][goalX] = 'goal';

  // Ensure start and goal are walkable and not wall
  grid[0][0] = 'path';
  grid[0][1] = 'path';
  grid[size-1][size-1] = 'path';
  grid[size-1][size-2] = 'path';

  return {
    id: level,
    worldId: WorldId.Mazes,
    levelNumber: level,
    instruction: `مغامرة المتاهة! ساعد القطة مشمش مشمش 🐱 للوصول إلى العظمة/السمكة السحرية 🐟 باستخدام أسهم الحركة:`,
    data: {
      type: 'maze_grid',
      grid,
      size,
      catPos: { x: startX, y: startY },
      targetPos: { x: goalX, y: goalY }
    },
    correctAnswer: `${goalX}_${goalY}`,
    hint: `استخدم أزرار الأسهم للحفْر ومساعدة مشمش 🐱. تفادى الجدران الخشبية البنية البارزة!`,
    rewardCoins: 45,
    rewardStars: 2
  };
}

// 6. Secret Room lock riddles
function generateSecretPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  // Rotate riddles list
  const selectedRiddle = RIDDLES[seed % RIDDLES.length];
  
  return {
    id: level,
    worldId: WorldId.Secret,
    levelNumber: level,
    instruction: `الغرفة السرية المغلقة! احزر اللغز التالي لفتح القفل القديم والعبور إلى الكنز:`,
    data: {
      type: 'riddle',
      questionText: selectedRiddle.q,
      choices: selectedRiddle.options
    },
    correctAnswer: selectedRiddle.correct,
    hint: selectedRiddle.hint,
    rewardCoins: 40,
    rewardStars: 2
  };
}

// 7. Logic Sequence challenges
function generateLogicPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  const isScaleLogic = level % 2 === 0;

  if (isScaleLogic) {
    const scales = [
      { text: 'الأسد أكل وزناً أكبر من الأرنب، والأرنب أكل وزناً أكبر من النملة 🐜. من هو الأثقل وزناً؟', choices: ['الأسد 🦁', 'الأرنب 🐰', 'النملة 🐜'], ans: 'الأسد 🦁', hint: 'الأسد ملك جائع وأقوى من الأرنب الضعيف بكثير!' },
      { text: 'الفيل 🐘 أكبر من الغزال 🦌، والغزال أكبر من العصفور 🐦. من هو أصغر واحد بين الجميع؟', choices: ['الفيل 🐘', 'الغزال 🦌', 'العصفور 🐦'], ans: 'العصفور 🐦', hint: 'العصفور الصغير خفيف ويطير!' },
      { text: 'الطيارة تطير أسرع من السيارة البطلة 🚗، والسيارة تسير أسرع من السلحفاة الصغيرة 🐢. ما هو أسرع شيء على الإطلاق؟', choices: ['الطيارة ✈️', 'السيارة 🚗', 'السلحفاة 🐢'], ans: 'الطيارة ✈️', hint: 'وسيلة السفر التي تعبر المحيط والغيود بسرعتها الهائلة.' }
    ];
    const pickedScale = scales[seed % scales.length];
    return {
      id: level,
      worldId: WorldId.Logic,
      levelNumber: level,
      instruction: `استخدم تفكيرك المنطقي الفائق لمعرفة الإجابة الصحيحة:`,
      data: {
        type: 'scale_logic',
        puzzleText: pickedScale.text,
        choices: pickedScale.choices
      },
      correctAnswer: pickedScale.ans,
      hint: pickedScale.hint,
      rewardCoins: 35,
      rewardStars: 2
    };
  } else {
    // Shape logic sequences
    const sequences = [
      { sequence: ['🔺', '⭐️', '🔺', '⭐️', '🔺'], next: '⭐️', options: ['🔺', '⭐️', '🟡'], hint: 'انظر كيف يتبادل المثلث الأحمر والنجمة الذهبية مكانهما!' },
      { sequence: ['🔴', '🟩', '🟡', '🔴', '🟩'], next: '🟡', options: ['🔴', '🟩', '🟡'], hint: 'هذه دائرة حمراء، تليها علبة خضراء، تليها كرة صفراء. ما التالي؟' },
      { sequence: ['🚀', '🚀', '🛸', '🚀', '🚀'], next: '🛸', options: ['🚀', '🛸', '👾'], hint: 'صاروخان سريعان يليهما صحن طائر ملون!' }
    ];
    const pickedSeq = sequences[seed % sequences.length];
    return {
      id: level,
      worldId: WorldId.Logic,
      levelNumber: level,
      instruction: `لعبة الأشكال المتسلسلة! ما هو الشكل النجمي أو السحري الذي عليه الدور ليكمل القاطرة السريعة؟`,
      data: {
        type: 'shape_sequence',
        sequence: pickedSeq.sequence,
        choices: pickedSeq.options
      },
      correctAnswer: pickedSeq.next,
      hint: pickedSeq.hint,
      rewardCoins: 30,
      rewardStars: 1
    };
  }
}

// 8. Hidden Objects differences
function generateHiddenPuzzle(level: number, seed: number, difficulty: Difficulty): PuzzleQuestion {
  // Generates a grid of emoji grids where exactly ONE emoji is different, kids find and tap it
  const isOddOneOut = level % 2 === 0;

  if (isOddOneOut) {
    const pairs = [
      { normal: '🦁', odd: '🐯', name: 'النمر المخطط' },
      { normal: '🍏', odd: '🍎', name: 'التفاحة الحمراء الشقية' },
      { normal: '🐼', odd: '🐻', name: 'الدب البني الكسول' },
      { normal: '🚗', odd: '🚓', name: 'سيارة الشرطة الزرقاء' },
      { normal: '🦉', odd: '🦅', name: 'النسر الجسور' },
      { normal: '🍪', odd: '🍩', name: 'الدونات الملونة' },
      { normal: '🎈', odd: '🧸', name: 'دمية الدب اللطيف' }
    ];
    const pickedPair = pairs[seed % pairs.length];
    const gridSize = level <= 3 ? 9 : level <= 7 ? 12 : 16; // 3x3, 4x3, 4x4 grid size
    const items = new Array(gridSize - 1).fill(pickedPair.normal);
    
    // Choose random spot for odd emoji
    const oddIndex = seed % gridSize;
    items.splice(oddIndex, 0, pickedPair.odd);

    return {
      id: level,
      worldId: WorldId.Hidden,
      levelNumber: level,
      instruction: `البحث عن الغريب! ابحث عن الشكل المختلف المختبئ بين أصدقائه واضغط عليه مباشرة:`,
      data: {
        type: 'find_odd',
        gridItems: items,
        correctIndex: oddIndex,
        cols: Math.ceil(Math.sqrt(gridSize))
      },
      correctAnswer: oddIndex, // The chosen index
      hint: `ابحث عن شيء ملامحه تختلف؛ دقق في الألوان أو الوجوه بدقة، وابحث عن "${pickedPair.name}" وسط زملائه!`,
      rewardCoins: 35,
      rewardStars: 2
    };
  } else {
    // Find the requested hidden target object inside a cozy cute room array
    const environments = [
      { title: 'الحديقة السعيدة 🌳🌷🌱🐞', target: '🐞', name: 'الخنفساء الصغيرة الحمراء "الدعسوقة"' },
      { title: 'غرفة الألعاب الممتعة 🧸🚗🧩🎈', target: '🧩', name: 'قطعة الفازل السحرية "البازل"' },
      { title: 'فضاء النجوم البعيد 🚀🛸⭐🪐', target: '🪐', name: 'كوكب زحل ذو الحلقات الذهبية' },
      { title: 'أعماق البحر المرجاني 🐠🐙🦀🐳', target: '🐳', name: 'الحوت الأزرق الضخم الصديق' }
    ];
    const env = environments[seed % environments.length];
    
    return {
      id: level,
      worldId: WorldId.Hidden,
      levelNumber: level,
      instruction: `لعبة العين الثاقبة! هل يمكنك العثور على "${env.name}" المختبئ في الصورة المفصلة أدناه؟`,
      data: {
        type: 'find_hidden_target',
        envTitle: env.title,
        targetIcon: env.target,
        elements: [env.target, ...ANIMALS.slice(0, 5), ...FRUITS.slice(0, 5), ...TOYS.slice(0, 4)].sort(() => (seed * 1.5) % 1)
      },
      correctAnswer: env.target,
      hint: `افتح عينيك جيداً وابحث عن شكل "${env.target}". إنه صغير ولطيف ويتألق وسط الطبيعة!`,
      rewardCoins: 35,
      rewardStars: 2
    };
  }
}
