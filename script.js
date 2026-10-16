// Data Aktiviti
const activities = {
    1: {
        title: "🦵 Aktiviti 1: Otot Paha",
        levels: {
            1: {
                question: "Otot manakah yang terlibat semasa melakukan senaman regangan paha?",
                options: [
                    { text: "Otot Paha", emoji: "🦵", correct: true },
                    { text: "Otot Tangan", emoji: "💪", correct: false },
                    { text: "Otot Leher", emoji: "🧠", correct: false },
                    { text: "Otot Mata", emoji: "👁️", correct: false }
                ]
            },
            2: {
                question: "Semasa regangan paha, bahagian manakah yang akan terasa?",
                options: [
                    { text: "Paha Depan", emoji: "🦵", correct: true },
                    { text: "Jari Kaki", emoji: "🦶", correct: false },
                    { text: "Hidung", emoji: "👃", correct: false },
                    { text: "Telinga", emoji: "👂", correct: false }
                ]
            }
        }
    },
    2: {
        title: "💪 Aktiviti 2: Otot Bahu",
        levels: {
            1: {
                question: "Otot manakah yang terlibat semasa melakukan regangan bahu?",
                options: [
                    { text: "Otot Bahu", emoji: "💪", correct: true },
                    { text: "Otot Perut", emoji: "🫃", correct: false },
                    { text: "Otot Kaki", emoji: "🦵", correct: false },
                    { text: "Otot Rambut", emoji: "💇", correct: false }
                ]
            },
            2: {
                question: "Apakah yang akan anda rasa semasa regangan bahu?",
                options: [
                    { text: "Tarik pada bahu", emoji: "🤸", correct: true },
                    { text: "Gatal pada kaki", emoji: "🦶", correct: false },
                    { text: "Sakit pada gigi", emoji: "🦷", correct: false },
                    { text: "Sejuk pada tangan", emoji: "❄️", correct: false }
                ]
            }
        }
    },
    3: {
        title: "🤚 Aktiviti 3: Otot Tangan",
        levels: {
            1: {
                question: "Otot manakah yang terlibat semasa melakukan regangan tangan?",
                options: [
                    { text: "Otot Tangan", emoji: "🤚", correct: true },
                    { text: "Otot Leher", emoji: "🧠", correct: false },
                    { text: "Otot Paha", emoji: "🦵", correct: false },
                    { text: "Otot Hidung", emoji: "👃", correct: false }
                ]
            },
            2: {
                question: "Semasa regangan tangan, bahagian manakah yang akan terasa?",
                options: [
                    { text: "Lengan", emoji: "💪", correct: true },
                    { text: "Kaki", emoji: "🦶", correct: false },
                    { text: "Perut", emoji: "🫃", correct: false },
                    { text: "Kepala", emoji: "🧠", correct: false }
                ]
            }
        }
    },
    4: {
        title: "🧘 Aktiviti 4: Otot Badan Atas",
        levels: {
            1: {
                question: "Otot manakah yang terlibat semasa regangan badan atas?",
                options: [
                    { text: "Otot Badan Atas", emoji: "🧘", correct: true },
                    { text: "Otot Kaki", emoji: "🦵", correct: false },
                    { text: "Otot Jari", emoji: "👆", correct: false },
                    { text: "Otot Lutut", emoji: "🦵", correct: false }
                ]
            },
            2: {
                question: "Apakah manfaat regangan badan atas?",
                options: [
                    { text: "Melenturkan badan", emoji: "🤸", correct: true },
                    { text: "Mengeraskan otot", emoji: "💪", correct: false },
                    { text: "Melemahkan badan", emoji: "😴", correct: false },
                    { text: "Menyakitkan badan", emoji: "🤒", correct: false }
                ]
            }
        }
    },
    5: {
        title: "🏆 Aktiviti 5: Cabaran Akhir",
        levels: {
            1: {
                question: "Berapakah bilangan otot utama yang terlibat dalam senaman regangan?",
                options: [
                    { text: "4 Otot Utama", emoji: "4️⃣", correct: true },
                    { text: "10 Otot Utama", emoji: "🔟", correct: false },
                    { text: "1 Otot Utama", emoji: "1️⃣", correct: false },
                    { text: "100 Otot Utama", emoji: "💯", correct: false }
                ]
            },
            2: {
                question: "Apakah kepentingan senaman regangan?",
                options: [
                    { text: "Meningkatkan kelenturan", emoji: "🤸", correct: true },
                    { text: "Mengurangkan tenaga", emoji: "😴", correct: false },
                    { text: "Menyebabkan sakit", emoji: "🤕", correct: false },
                    { text: "Membuat kita lemah", emoji: "😵", correct: false }
                ]
            }
        }
    }
};

// State
let currentActivity = 1;
let currentLevel = 1;
let score = 0;
let answered = false;

// DOM Elements
const activityArea = document.getElementById('activityArea');
const resultArea = document.getElementById('resultArea');
const activityTitle = document.getElementById('activityTitle');
const activityContent = document.getElementById('activityContent');
const levelText = document.getElementById('levelText');
const progressFill = document.getElementById('progressFill');
const feedback = document.getElementById('feedback');
const resultText = document.getElementById('resultText');

// Fungsi Mula Aktiviti
function startActivity(activityId) {
    currentActivity = activityId;
    currentLevel = 1;
    score = 0;
    answered = false;
    
    document.querySelector('.menu-section').classList.add('hidden');
    document.querySelector('.info-section').classList.add('hidden');
    activityArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    
    loadLevel();
}

// Muat Level
function loadLevel() {
    const activity = activities[currentActivity];
    const level = activity.levels[currentLevel];
    
    activityTitle.textContent = activity.title;
    levelText.textContent = `Level ${currentLevel}`;
    progressFill.style.width = currentLevel === 1 ? '50%' : '100%';
    feedback.classList.add('hidden');
    feedback.className = 'feedback hidden';
    answered = false;
    
    let html = `<p class="question-text">${level.question}</p>`;
    html += '<div class="options-grid">';
    
    level.options.forEach((opt, index) => {
        html += `
            <button class="option-btn" onclick="checkAnswer(${index}, ${opt.correct})">
                <span class="emoji">${opt.emoji}</span>
                <span>${opt.text}</span>
            </button>
        `;
    });
    
    html += '</div>';
    activityContent.innerHTML = html;
}

// Semak Jawapan
function checkAnswer(index, isCorrect) {
    if (answered) return;
    answered = true;
    
    const buttons = document.querySelectorAll('.option-btn');
    const selectedBtn = buttons[index];
    
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
        feedback.textContent = "🎉 Betul! Syabas!";
        feedback.className = "feedback correct";
    } else {
        selectedBtn.classList.add('wrong');
        feedback.textContent = "❌ Cuba lagi! Jawapan yang betul telah ditunjukkan.";
        feedback.className = "feedback wrong";
        // Tunjukkan jawapan betul
        buttons.forEach((btn, i) => {
            if (activities[currentActivity].levels[currentLevel].options[i].correct) {
                setTimeout(() => btn.classList.add('correct'), 500);
            }
        });
    }
    
    feedback.classList.remove('hidden');
    
    // Automatik ke level seterusnya selepas 2 saat
    setTimeout(() => {
        if (currentLevel === 1) {
            currentLevel = 2;
            loadLevel();
        } else {
            showResult();
        }
    }, 2000);
}

// Tunjuk Keputusan
function showResult() {
    activityArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    
    if (score === 2) {
        resultText.textContent = `🌟 Cemerlang! Anda menjawab semua dengan betul untuk ${activities[currentActivity].title}!`;
    } else if (score === 1) {
        resultText.textContent = `👍 Bagus! Anda menjawab 1 daripada 2 dengan betul. Cuba lagi untuk lebih baik!`;
    } else {
        resultText.textContent = `💪 Jangan putus asa! Cuba lagi aktiviti ini untuk memahami otot-otot regangan.`;
    }
}

// Aktiviti Seterusnya
function nextActivity() {
    if (currentActivity < 5) {
        startActivity(currentActivity + 1);
    } else {
        goHome();
    }
}

// Kembali
function goBack() {
    activityArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    document.querySelector('.menu-section').classList.remove('hidden');
    document.querySelector('.info-section').classList.remove('hidden');
}

// Menu Utama
function goHome() {
    activityArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    document.querySelector('.menu-section').classList.remove('hidden');
    document.querySelector('.info-section').classList.remove('hidden');
}
