/* =====================================================
   SISTEM BUNYI (Web Audio API - Tiada fail luaran)
   ===================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { console.log('Audio tidak disokong'); }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    const icon = document.getElementById('soundIcon');
    const label = document.getElementById('soundLabel');
    if (soundEnabled) {
        icon.textContent = '🔊';
        label.textContent = 'Bunyi ON';
        btn.classList.remove('off');
        playPick();
    } else {
        icon.textContent = '🔇';
        label.textContent = 'Bunyi OFF';
        btn.classList.add('off');
    }
}

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.12, delay = 0) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        const t = audioCtx.currentTime + delay;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(volume, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.start(t);
        osc.stop(t + duration);
    } catch (e) { /* silent */ }
}

function playCorrect() {
    playTone(523.25, 0.12, 'sine', 0.15, 0);
    playTone(659.25, 0.12, 'sine', 0.15, 0.1);
    playTone(783.99, 0.15, 'sine', 0.15, 0.2);
    playTone(1046.50, 0.25, 'sine', 0.15, 0.3);
}

function playWrong() {
    playTone(220, 0.15, 'sawtooth', 0.1, 0);
    playTone(165, 0.3, 'sawtooth', 0.1, 0.13);
}

function playPick() { playTone(800, 0.06, 'square', 0.08, 0); }

function playFlip() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { /* silent */ }
}

function playDrop() {
    playTone(700, 0.08, 'sine', 0.12, 0);
    playTone(500, 0.12, 'sine', 0.1, 0.06);
}

function playScore() {
    playTone(1318.51, 0.1, 'sine', 0.1, 0);
    playTone(1567.98, 0.15, 'sine', 0.1, 0.08);
}

function playLevelComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => { playTone(freq, 0.2, 'triangle', 0.15, i * 0.12); });
    playTone(1318.51, 0.4, 'triangle', 0.15, 0.5);
}

function playVictory() {
    const melody = [
        { f: 523.25, d: 0.15, t: 0 }, { f: 523.25, d: 0.15, t: 0.15 },
        { f: 523.25, d: 0.15, t: 0.3 }, { f: 523.25, d: 0.3, t: 0.45 },
        { f: 415.30, d: 0.3, t: 0.8 }, { f: 466.16, d: 0.3, t: 1.1 },
        { f: 523.25, d: 0.5, t: 1.4 }, { f: 466.16, d: 0.2, t: 1.9 },
        { f: 523.25, d: 0.8, t: 2.1 }
    ];
    melody.forEach(n => playTone(n.f, n.d, 'triangle', 0.15, n.t));
}

function playStart() {
    playTone(440, 0.1, 'sine', 0.12, 0);
    playTone(660, 0.15, 'sine', 0.12, 0.08);
}

/* =====================================================
   DATA AKTIVITI
   ===================================================== */
const activities = {
    1: {
        title: "🦵 Aktiviti 1: Padanan Otot Paha",
        type: "match",
        levels: {
            1: {
                question: "Padankan senaman regangan dengan otot paha yang terlibat!",
                pairs: [
                    { left: "🦵 Regangan Paha Depan", right: "Otot Paha Depan" },
                    { left: "🦵 Regangan Paha Belakang", right: "Otot Paha Belakang" },
                    { left: "🦵 Regangan Kaki", right: "Otot Betis" }
                ]
            },
            2: {
                question: "Padankan jenis senaman dengan otot paha yang betul!",
                pairs: [
                    { left: "🦵 Lunges", right: "Otot Paha & Pinggul" },
                    { left: "🦵 Squat", right: "Otot Paha Depan" },
                    { left: "🦵 Leg Curl", right: "Otot Paha Belakang" },
                    { left: "🦵 Calf Raise", right: "Otot Betis" }
                ]
            }
        }
    },
    2: {
        title: "💪 Aktiviti 2: Drag & Drop Otot Bahu",
        type: "drag",
        levels: {
            1: {
                question: "Seret nama otot ke bahagian badan yang betul!",
                items: [
                    { id: "bahu", label: "Otot Bahu", emoji: "💪" },
                    { id: "leher", label: "Otot Leher", emoji: "🧠" },
                    { id: "lengan", label: "Otot Lengan", emoji: "🦾" }
                ],
                zones: [
                    { id: "bahu", label: "Bahu", emoji: "🤸" },
                    { id: "leher", label: "Leher", emoji: "🧍" },
                    { id: "lengan", label: "Lengan", emoji: "🦾" }
                ]
            },
            2: {
                question: "Seret senaman regangan ke otot yang betul!",
                items: [
                    { id: "shrug", label: "Shrug", emoji: "🤷" },
                    { id: "neck", label: "Neck Stretch", emoji: "🧍" },
                    { id: "arm", label: "Arm Circles", emoji: "🔄" },
                    { id: "shoulder", label: "Shoulder Roll", emoji: "🔃" }
                ],
                zones: [
                    { id: "shrug", label: "Trapezius", emoji: "💪" },
                    { id: "neck", label: "Leher", emoji: "🧠" },
                    { id: "arm", label: "Lengan", emoji: "🦾" },
                    { id: "shoulder", label: "Bahu", emoji: "🤸" }
                ]
            }
        }
    },
    3: {
        title: "🤚 Aktiviti 3: Memori Otot Tangan",
        type: "memory",
        levels: {
            1: {
                question: "Cari pasangan kad yang sama! (6 kad)",
                cards: [
                    { id: 1, label: "Otot Tangan", emoji: "🤚", matchId: 1 },
                    { id: 2, label: "Otot Lengan", emoji: "💪", matchId: 2 },
                    { id: 3, label: "Otot Jari", emoji: "👆", matchId: 3 },
                    { id: 1, label: "Otot Tangan", emoji: "🤚", matchId: 1 },
                    { id: 2, label: "Otot Lengan", emoji: "💪", matchId: 2 },
                    { id: 3, label: "Otot Jari", emoji: "👆", matchId: 3 }
                ]
            },
            2: {
                question: "Cari pasangan kad yang sama! (8 kad)",
                cards: [
                    { id: 1, label: "Otot Tangan", emoji: "🤚", matchId: 1 },
                    { id: 2, label: "Otot Lengan", emoji: "💪", matchId: 2 },
                    { id: 3, label: "Otot Jari", emoji: "👆", matchId: 3 },
                    { id: 4, label: "Pergelangan", emoji: "🖐️", matchId: 4 },
                    { id: 1, label: "Otot Tangan", emoji: "🤚", matchId: 1 },
                    { id: 2, label: "Otot Lengan", emoji: "💪", matchId: 2 },
                    { id: 3, label: "Otot Jari", emoji: "👆", matchId: 3 },
                    { id: 4, label: "Pergelangan", emoji: "🖐️", matchId: 4 }
                ]
            }
        }
    },
    4: {
        title: "🧘 Aktiviti 4: Padanan Badan Atas",
        type: "match",
        levels: {
            1: {
                question: "Padankan otot badan atas dengan gambar!",
                pairs: [
                    { left: "🧘 Otot Perut", right: "Otot Perut (Abs)" },
                    { left: "🧍 Otot Belakang", right: "Otot Belakang" },
                    { left: "🫁 Otot Dada", right: "Otot Dada" }
                ]
            },
            2: {
                question: "Padankan senaman dengan otot badan atas!",
                pairs: [
                    { left: "🤸 Sit-Up", right: "Otot Perut" },
                    { left: "🏋️ Push-Up", right: "Otot Dada" },
                    { left: "🧎 Plank", right: "Otot Perut & Belakang" },
                    { left: "🚣 Row", right: "Otot Belakang" }
                ]
            }
        }
    },
    5: {
        title: "🏆 Aktiviti 5: Cabaran Akhir",
        type: "drag",
        levels: {
            1: {
                question: "Seret nama otot ke gambar yang betul!",
                items: [
                    { id: "paha", label: "Otot Paha", emoji: "🦵" },
                    { id: "bahu", label: "Otot Bahu", emoji: "💪" },
                    { id: "tangan", label: "Otot Tangan", emoji: "🤚" },
                    { id: "perut", label: "Otot Perut", emoji: "🧘" }
                ],
                zones: [
                    { id: "paha", label: "Paha", emoji: "🦵" },
                    { id: "bahu", label: "Bahu", emoji: "🤸" },
                    { id: "tangan", label: "Tangan", emoji: "🤚" },
                    { id: "perut", label: "Perut", emoji: "🫃" }
                ]
            },
            2: {
                question: "Seret otot ke kumpulan yang betul!",
                items: [
                    { id: "paha", label: "Otot Paha", emoji: "🦵" },
                    { id: "bahu", label: "Otot Bahu", emoji: "💪" },
                    { id: "tangan", label: "Otot Tangan", emoji: "🤚" },
                    { id: "perut", label: "Otot Perut", emoji: "🧘" },
                    { id: "leher", label: "Otot Leher", emoji: "🧠" },
                    { id: "belakang", label: "Otot Belakang", emoji: "🧍" }
                ],
                zones: [
                    { id: "paha", label: "Kaki", emoji: "🦵" },
                    { id: "bahu", label: "Bahu", emoji: "🤸" },
                    { id: "tangan", label: "Tangan", emoji: "🤚" },
                    { id: "perut", label: "Badan", emoji: "🧘" },
                    { id: "leher", label: "Leher", emoji: "🧠" },
                    { id: "belakang", label: "Belakang", emoji: "🧍" }
                ]
            }
        }
    }
};

/* =====================================================
   STATE
   ===================================================== */
let currentActivity = 1;
let currentLevel = 1;
let totalScore = 0;
let selectedLeft = null;
let matchedPairs = [];
let draggedItem = null;
let flippedCards = [];
let matchedMemory = 0;
let lockBoard = false;

/* =====================================================
   DOM
   ===================================================== */
const activityArea = document.getElementById('activityArea');
const resultArea = document.getElementById('resultArea');
const activityTitle = document.getElementById('activityTitle');
const activityContent = document.getElementById('activityContent');
const levelText = document.getElementById('levelText');
const progressFill = document.getElementById('progressFill');
const feedback = document.getElementById('feedback');
const resultText = document.getElementById('resultText');
const resultTitle = document.getElementById('resultTitle');
const resultEmoji = document.getElementById('resultEmoji');
const scoreText = document.getElementById('scoreText');
const nextBtn = document.getElementById('nextBtn');
const starsDisplay = document.getElementById('starsDisplay');

/* =====================================================
   MULA AKTIVITI
   ===================================================== */
function startActivity(activityId) {
    initAudio();
    playStart();
    currentActivity = activityId;
    currentLevel = 1;
    totalScore = 0;
    document.getElementById('menuSection').classList.add('hidden');
    document.getElementById('infoSection').classList.add('hidden');
    activityArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    loadLevel();
}

function loadLevel() {
    const activity = activities[currentActivity];
    const level = activity.levels[currentLevel];
    activityTitle.textContent = activity.title;
    levelText.textContent = `🎯 Level ${currentLevel}`;
    progressFill.style.width = currentLevel === 1 ? '50%' : '100%';
    scoreText.textContent = `⭐ ${totalScore}`;
    feedback.classList.add('hidden');
    feedback.className = 'feedback hidden';
    selectedLeft = null;
    matchedPairs = [];
    draggedItem = null;
    flippedCards = [];
    matchedMemory = 0;
    lockBoard = false;
    if (activity.type === 'match') renderMatch(level);
    else if (activity.type === 'drag') renderDrag(level);
    else if (activity.type === 'memory') renderMemory(level);
}

/* =====================================================
   RENDER: PADANAN
   ===================================================== */
function renderMatch(level) {
    const leftItems = shuffle([...level.pairs]);
    const rightItems = shuffle([...level.pairs]);
    let html = `<p class="question-text">${level.question}</p>`;
    html += `<div class="match-wrapper">`;
    html += `<div class="match-column"><h4>📌 Senaman</h4>`;
    leftItems.forEach(p => {
        html += `<div class="match-item" data-side="left" data-key="${p.right}" onclick="selectMatch(this)">${p.left}</div>`;
    });
    html += `</div><div class="match-column"><h4>💪 Otot</h4>`;
    rightItems.forEach(p => {
        html += `<div class="match-item" data-side="right" data-key="${p.right}" onclick="selectMatch(this)">${p.right}</div>`;
    });
    html += `</div></div>`;
    activityContent.innerHTML = html;
}

function selectMatch(el) {
    if (el.classList.contains('matched')) return;
    playPick();
    if (!selectedLeft) {
        document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
        selectedLeft = el;
    } else {
        if (selectedLeft === el) {
            selectedLeft.classList.remove('selected');
            selectedLeft = null;
            return;
        }
        if (selectedLeft.dataset.side === el.dataset.side) {
            selectedLeft.classList.remove('selected');
            el.classList.add('selected');
            selectedLeft = el;
            return;
        }
        const first = selectedLeft;
        const second = el;
        if (first.dataset.key === second.dataset.key) {
            first.classList.remove('selected');
            first.classList.add('matched');
            second.classList.add('matched');
            matchedPairs.push(first.dataset.key);
            totalScore += 10;
            scoreText.textContent = `⭐ ${totalScore}`;
            playCorrect();
            playScore();
            showFeedback('correct', '✅ Betul! Padanan yang tepat!');
            selectedLeft = null;
            const total = activities[currentActivity].levels[currentLevel].pairs.length;
            if (matchedPairs.length === total) setTimeout(() => finishLevel(), 900);
        } else {
            first.classList.remove('selected');
            first.classList.add('wrong-match');
            second.classList.add('wrong-match');
            playWrong();
            showFeedback('wrong', '❌ Salah padanan. Cuba lagi!');
            setTimeout(() => {
                first.classList.remove('wrong-match');
                second.classList.remove('wrong-match');
            }, 500);
            selectedLeft = null;
        }
    }
}

/* =====================================================
   RENDER: DRAG & DROP
   ===================================================== */
function renderDrag(level) {
    const items = shuffle([...level.items]);
    let html = `<p class="question-text">${level.question}</p>`;
    html += `<div class="drag-wrapper"><div class="drag-pool" id="dragPool">`;
    items.forEach(item => {
        html += `<div class="drag-item" draggable="true" data-id="${item.id}" 
                    ondragstart="dragStart(event)" ondragend="dragEnd(event)"
                    ontouchstart="touchStart(event)" ontouchmove="touchMove(event)" ontouchend="touchEnd(event)">
                    ${item.emoji} ${item.label}
                 </div>`;
    });
    html += `</div><div class="drop-zones">`;
    level.zones.forEach(zone => {
        html += `<div class="drop-zone" data-id="${zone.id}" 
                    ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="dropItem(event)">
                    <div class="zone-emoji">${zone.emoji}</div>
                    <div class="zone-label">${zone.label}</div>
                    <div class="zone-slot">Seret di sini</div>
                 </div>`;
    });
    html += `</div></div>`;
    activityContent.innerHTML = html;
}

function dragStart(e) {
    if (e.target.classList.contains('correct')) { e.preventDefault(); return; }
    draggedItem = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}
function dragEnd(e) { e.target.classList.remove('dragging'); }
function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
function dragLeave(e) { e.currentTarget.classList.remove('over'); }

function dropItem(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('over');
    if (!draggedItem) return;
    if (zone.classList.contains('filled')) return;
    const itemId = draggedItem.dataset.id;
    const zoneId = zone.dataset.id;
    if (itemId === zoneId) {
        zone.classList.add('filled');
        zone.querySelector('.zone-slot').innerHTML = draggedItem.innerHTML;
        draggedItem.classList.add('correct');
        draggedItem.setAttribute('draggable', 'false');
        draggedItem.style.display = 'none';
        totalScore += 10;
        scoreText.textContent = `⭐ ${totalScore}`;
        playDrop();
        setTimeout(() => playCorrect(), 100);
        showFeedback('correct', '✅ Tepat sekali!');
        checkDragComplete();
    } else {
        zone.classList.add('wrong');
        playWrong();
        showFeedback('wrong', '❌ Bukan di sini. Cuba tempat lain!');
        setTimeout(() => zone.classList.remove('wrong'), 500);
    }
    draggedItem = null;
}

let touchClone = null;
function touchStart(e) {
    const target = e.target.closest('.drag-item');
    if (!target || target.classList.contains('correct')) return;
    draggedItem = target;
    const touch = e.touches[0];
    touchClone = target.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.zIndex = '9999';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.opacity = '0.85';
    touchClone.style.left = (touch.clientX - 50) + 'px';
    touchClone.style.top = (touch.clientY - 25) + 'px';
    document.body.appendChild(touchClone);
    target.style.opacity = '0.3';
}

function touchMove(e) {
    if (!touchClone) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchClone.style.left = (touch.clientX - 50) + 'px';
    touchClone.style.top = (touch.clientY - 25) + 'px';
    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('over'));
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const zone = el ? el.closest('.drop-zone') : null;
    if (zone && !zone.classList.contains('filled')) zone.classList.add('over');
}

function touchEnd(e) {
    if (!touchClone) return;
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const zone = el ? el.closest('.drop-zone') : null;
    if (zone && draggedItem && !zone.classList.contains('filled')) {
        const itemId = draggedItem.dataset.id;
        const zoneId = zone.dataset.id;
        if (itemId === zoneId) {
            zone.classList.add('filled');
            zone.classList.remove('over');
            zone.querySelector('.zone-slot').innerHTML = draggedItem.innerHTML;
            draggedItem.classList.add('correct');
            draggedItem.style.display = 'none';
            totalScore += 10;
            scoreText.textContent = `⭐ ${totalScore}`;
            playDrop();
            setTimeout(() => playCorrect(), 100);
            showFeedback('correct', '✅ Tepat sekali!');
            checkDragComplete();
        } else {
            zone.classList.add('wrong');
            playWrong();
            showFeedback('wrong', '❌ Bukan di sini. Cuba tempat lain!');
            setTimeout(() => zone.classList.remove('wrong'), 500);
        }
    }
    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('over'));
    if (draggedItem) draggedItem.style.opacity = '1';
    touchClone.remove();
    touchClone = null;
    draggedItem = null;
}

function checkDragComplete() {
    const totalItems = activities[currentActivity].levels[currentLevel].items.length;
    const correctItems = document.querySelectorAll('.drag-item.correct').length;
    if (correctItems === totalItems) setTimeout(() => finishLevel(), 900);
}

/* =====================================================
   RENDER: MEMORY CARD
   ===================================================== */
function renderMemory(level) {
    const cards = shuffle([...level.cards]);
    let html = `<p class="question-text">${level.question}</p>`;
    html += `<div class="memory-grid" id="memoryGrid">`;
    cards.forEach((card, i) => {
        html += `
            <div class="memory-card" data-match="${card.matchId}" data-index="${i}" onclick="flipCard(this)">
                <div class="memory-card-inner">
                    <div class="memory-card-front">❓</div>
                    <div class="memory-card-back">
                        <div class="card-emoji">${card.emoji}</div>
                        <div>${card.label}</div>
                    </div>
                </div>
            </div>`;
    });
    html += `</div>`;
    activityContent.innerHTML = html;
}

function flipCard(card) {
    if (lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    playFlip();
    card.classList.add('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        lockBoard = true;
        const [a, b] = flippedCards;
        if (a.dataset.match === b.dataset.match) {
            setTimeout(() => {
                a.classList.add('matched');
                b.classList.add('matched');
                matchedMemory++;
                totalScore += 10;
                scoreText.textContent = `⭐ ${totalScore}`;
                playCorrect();
                showFeedback('correct', '✅ Padanan memori yang tepat!');
                flippedCards = [];
                lockBoard = false;
                const totalPairs = activities[currentActivity].levels[currentLevel].cards.length / 2;
                if (matchedMemory === totalPairs) setTimeout(() => finishLevel(), 900);
            }, 500);
        } else {
            playWrong();
            showFeedback('wrong', '❌ Bukan pasangan yang sama.');
            setTimeout(() => {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                flippedCards = [];
                lockBoard = false;
            }, 1000);
        }
    }
}

/* =====================================================
   TAMAT LEVEL & AKTIVITI
   ===================================================== */
function finishLevel() {
    if (currentLevel === 1) {
        playLevelComplete();
        showFeedback('info', '🎊 Level 1 selesai! Bersedia untuk Level 2?');
        setTimeout(() => {
            currentLevel = 2;
            loadLevel();
        }, 2200);
    } else {
        showResult();
    }
}

function showResult() {
    activityArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    const maxScore = calculateMaxScore();
    const percent = Math.round((totalScore / maxScore) * 100);
    let emoji, title, text;
    if (percent >= 80) {
        emoji = '🏆';
        title = 'Cemerlang!';
        text = `Hebat! Anda mendapat ${totalScore} markah (${percent}%). Anda sudah kenal otot-otot regangan dengan baik!`;
        playVictory();
        createConfetti();
    } else if (percent >= 50) {
        emoji = '👍';
        title = 'Bagus!';
        text = `Anda mendapat ${totalScore} markah (${percent}%). Teruskan berlatih untuk jadi lebih baik!`;
        playLevelComplete();
    } else {
        emoji = '💪';
        title = 'Cuba Lagi!';
        text = `Anda mendapat ${totalScore} markah (${percent}%). Jangan putus asa, cuba lagi!`;
        playLevelComplete();
    }
    resultEmoji.textContent = emoji;
    resultTitle.textContent = title;
    resultText.textContent = text;
    
    const stars = percent >= 80 ? 5 : percent >= 60 ? 4 : percent >= 40 ? 3 : percent >= 20 ? 2 : 1;
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            starsHtml += `<span class="star-filled" style="animation-delay: ${i * 0.15}s">⭐</span>`;
        } else {
            starsHtml += `<span style="opacity: 0.25">⭐</span>`;
        }
    }
    starsDisplay.innerHTML = starsHtml;
    
    if (currentActivity >= 5) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'inline-block';
    }
}

function createConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#FFD93D', '#FF6B6B', '#43e97b', '#4facfe', '#f093fb', '#FFA500'];
    for (let i = 0; i < 40; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + '%';
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDelay = Math.random() * 2 + 's';
        conf.style.animationDuration = (2 + Math.random() * 2) + 's';
        conf.style.width = (6 + Math.random() * 10) + 'px';
        conf.style.height = (6 + Math.random() * 10) + 'px';
        container.appendChild(conf);
    }
}

function calculateMaxScore() {
    const activity = activities[currentActivity];
    if (activity.type === 'match') {
        return activity.levels[1].pairs.length * 10 + activity.levels[2].pairs.length * 10;
    } else if (activity.type === 'drag') {
        return activity.levels[1].items.length * 10 + activity.levels[2].items.length * 10;
    } else if (activity.type === 'memory') {
        return (activity.levels[1].cards.length / 2) * 10 + (activity.levels[2].cards.length / 2) * 10;
    }
    return 100;
}

/* =====================================================
   NAVIGASI
   ===================================================== */
function nextActivity() {
    if (currentActivity < 5) startActivity(currentActivity + 1);
    else goHome();
}

function retryActivity() { startActivity(currentActivity); }

function goBack() {
    playPick();
    activityArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    document.getElementById('menuSection').classList.remove('hidden');
    document.getElementById('infoSection').classList.remove('hidden');
}

function goHome() {
    playPick();
    activityArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    document.getElementById('menuSection').classList.remove('hidden');
    document.getElementById('infoSection').classList.remove('hidden');
}

/* =====================================================
   HELPER
   ===================================================== */
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function showFeedback(type, msg) {
    feedback.textContent = msg;
    feedback.className = `feedback ${type}`;
    feedback.classList.remove('hidden');
}

document.addEventListener('click', function initOnce() {
    initAudio();
    document.removeEventListener('click', initOnce);
}, { once: true });
