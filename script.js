// Tab navigation
const tabs = document.querySelectorAll('.tab');
const sections = [...document.querySelectorAll('main > section')];
tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const target = t.getAttribute('data-target');
    sections.forEach(s => s.style.display = (s.id === target) ? 'block' : 'none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Info box logic
const infoBox = document.getElementById('infoBox');
function renderInfo(key) {
  const item = info[key];
  if (!item) return;
  infoBox.innerHTML = `
    <strong>${item.title}</strong>
    <div class="muted" style="margin-top:6px">${item.body}</div>
  `;
  infoBox.classList.add('show');
}
document.getElementById('clearSelection')?.addEventListener('click', () => {
  infoBox.classList.remove('show');
  infoBox.innerHTML = '';
});

// Toggle hotspot outlines
document.getElementById('toggleHotspots')?.addEventListener('click', () => {
  document.querySelector('.diagram-wrap')?.classList.toggle('hotspots-visible');
});

// Arabic info entries
const info = {
  uterus: {
    title: 'الرحم',
    body: 'عضو عضلي يشبه الكمثرى، تتكوّن فيه بطانة الرحم، ويدعم نمو الجنين إذا حدث الإخصاب.'
  },
  lining: {
    title: 'بطانة الرحم',
    body: 'طبقة داخلية تتغير سمكها خلال الدورة الشهرية، وتُطرح أثناء الحيض.'
  },
  ovaryLeft: {
    title: 'المبيض (يسار)',
    body: 'ينتج البويضات والهرمونات مثل الإستروجين والبروجسترون. تنضج الجريبات هنا.'
  },
  ovaryRight: {
    title: 'المبيض (يمين)',
    body: 'ينتج البويضات والهرمونات مثل الإستروجين والبروجسترون. تنضج الجريبات هنا.'
  },
  oviductLeft: {
    title: 'قناة البيض (يسار)',
    body: 'أنبوب ينقل البويضة من المبيض إلى الرحم. ينتهي بأهداب تساعد على التقاط البويضة.'
  },
  oviductRight: {
    title: 'قناة البيض (يمين)',
    body: 'أنبوب ينقل البويضة من المبيض إلى الرحم. ينتهي بأهداب تساعد على التقاط البويضة.'
  },
  fimbriaeLeft: {
    title: 'الأهداب (يسار)',
    body: 'زوائد إصبعية قرب المبيض تساعد على التقاط البويضة إلى قناة البيض.'
  },
  fimbriaeRight: {
    title: 'الأهداب (يمين)',
    body: 'زوائد إصبعية قرب المبيض تساعد على التقاط البويضة إلى قناة البيض.'
  },
  cervix: {
    title: 'عنق الرحم',
    body: 'جزء ضيق يربط الرحم بالمهبل، يحتوي على قناة عنق الرحم.'
  },
  vagina: {
    title: 'المهبل',
    body: 'قناة عضلية تصل عنق الرحم بالفتحة الخارجية، جزء من القناة التناسلية.'
  },
  vaginalOpening: {
    title: 'الفتحة المهبلية الخارجية',
    body: 'المدخل الخارجي للقناة المهبلية، يفتح على السطح الخارجي للجسم.'
  }
};

//
// Hormone timeline
//
const daySlider = document.getElementById('daySlider');
const dayLabel = document.getElementById('dayLabel');
const phaseLabel = document.getElementById('phaseLabel');
const fshMarker = document.getElementById('fshMarker');
const lhMarker = document.getElementById('lhMarker');

function getPhase(day) {
  if (day <= 5) return 'طور تدفق الطمث';
  if (day <= 14) return 'طور الحويصلة';
  return 'طور الجسم الأصفر';
}

function setHormoneMarkers(day) {
  const fshPos = day <= 5 ? 12 : day <= 13 ? 28 : day === 14 ? 40 : 65;
  const lhPos = day <= 12 ? 40 : day === 13 ? 48 : day === 14 ? 60 : day <= 18 ? 70 : 80;
  fshMarker.style.left = fshPos + '%';
  lhMarker.style.left = lhPos + '%';
}
function updateTimeline() {
  const day = parseInt(daySlider.value, 10);
  dayLabel.textContent = 'اليوم ' + day;
  phaseLabel.textContent = getPhase(day);
  setHormoneMarkers(day);
}
daySlider?.addEventListener('input', updateTimeline);
updateTimeline();

//
// Cycle simulator
//
const cDaySlider = document.getElementById('cDaySlider');
const cDayLabel = document.getElementById('cDayLabel');
const cPhaseLabel = document.getElementById('cPhaseLabel');
const cEventList = document.getElementById('cEventList');

function cycleEvents(day) {
  const items = [];
  if (day <= 5) {
    items.push('يحدث انسلاخ بطانة الرحم.');
    items.push('يتدفق الدم والمخاط والنسيج الغذي من الرحم.');
    items.push('يبدأ الرحم في تكوين بطانة جديدة.');
  } else if (day <= 14) {
    items.push('تنمو العويصلات في المبيض بفعل FSH.');
    items.push('تفرز العويصلة الناضجة الإستروجين.');
    items.push('في اليوم 14، تحدث الإباضة بسبب طفرة LH.');
  } else {
    items.push('يتحول الجريب إلى الجسم الأصفر.');
    items.push('يفرز الجسم الأصفر البروجسترون لبناء بطانة الرحم.');
    items.push('إذا لم يحدث إخصاب، يتحلل الجسم الأصفر وتبدأ دورة جديدة.');
  }
  return items;
}

function updateCycle() {
  const day = parseInt(cDaySlider.value, 10);
  cDayLabel.textContent = 'اليوم ' + day;
  cPhaseLabel.textContent = getPhase(day);
  const events = cycleEvents(day);
  cEventList.innerHTML = events.map(e => `<li>${e}</li>`).join('');
}
cDaySlider?.addEventListener('input', updateCycle);
updateCycle();

//
// Quiz system
//
const quizData = [
  {
    q: 'أي هرمون يرتفع ليحفّز الإباضة؟',
    choices: [
      { txt: 'FSH', correct: false },
      { txt: 'LH', correct: true },
      { txt: 'الإستروجين', correct: false },
      { txt: 'البروجسترون', correct: false }
    ]
  },
  {
    q: 'أي عضو ينتج الخلايا البيضية (البويضات)؟',
    choices: [
      { txt: 'الرحم', correct: false },
      { txt: 'المبيض', correct: true },
      { txt: 'المهبل', correct: false },
      { txt: 'قناة البيض', correct: false }
    ]
  },
  {
    q: 'ما التغيرات التي تحدث للحوصلة بعد التبويض؟',
    choices: [
      { txt: 'تتحلل وتختفي تمامًا', correct: false },
      { txt: 'تتحول إلى الجسم الأصفر وتفرز البروجستيرون', correct: true },
      { txt: 'تنتج خلايا منوية', correct: false },
      { txt: 'تتحول إلى بطانة الرحم', correct: false }
    ]
  },
  {
    q: 'ماذا يحدث إذا نضجت أكثر من حوصلة خلال دورة الحيض؟',
    choices: [
      { txt: 'يحدث نزيف داخلي', correct: false },
      { txt: 'تتوقف الدورة تمامًا', correct: false },
      { txt: 'يحدث الحمل بتوأم', correct: true },
      { txt: 'تتحلل جميع الحويصلات', correct: false }
    ]
  },
  {
    q: 'في أي طور يفرز الجسم الأصفر البروجستيرون؟',
    choices: [
      { txt: 'طور الطمث', correct: false },
      { txt: 'طور الحويصلة', correct: false },
      { txt: 'طور الجسم الأصفر', correct: true },
      { txt: 'قبل التبويض مباشرة', correct: false }
    ]
  }
];


const qText = document.getElementById('qText');
const choicesBox = document.getElementById('choices');
const feedback = document.getElementById('feedback');
const nextQ = document.getElementById('nextQ');
const restartQ = document.getElementById('restartQ');
let qi = 0;

function renderQ() {
  const item = quizData[qi];
  qText.textContent = item.q;
  choicesBox.innerHTML = '';
  feedback.classList.remove('show');
  feedback.textContent = '';
  item.choices.forEach(c => {
    const btn = document.createElement('div');
    btn.className = 'choice';
    btn.textContent = c.txt;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.choice').forEach(x => x.classList.remove('correct', 'wrong'));
      btn.classList.add(c.correct ? 'correct' : 'wrong');
      feedback.textContent = c.correct ? 'إجابة صحيحة!' : 'ليست صحيحة — جرّب مرة أخرى.';
      feedback.classList.add('show');
    });
    choicesBox.appendChild(btn);
  });
}
nextQ?.addEventListener('click', () => {
  qi = (qi + 1) % quizData.length;
  renderQ();
});
restartQ?.addEventListener('click', () => {
  qi = 0;
  renderQ();
});
renderQ();
