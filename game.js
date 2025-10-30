// ===== GAME STATE =====
let clickCount = 0;
let bonusAmount = 0;
let prestigeLevel = 0;
let playerName = '';
let buttonSpeed = 1;
let currentTimeIndex = 0;
let unlockedAchievements = new Set();
let seenTimes = new Set();
let readMessages = new Set();
let moveButtonInterval = null;
let isMusicMuted = false;

// ===== ANTI-CHEAT SYSTEM =====
let lastClickTime = 0;
let clicksInSecond = 0;
let suspiciousActivity = 0;
let isCheater = false;
const MAX_CLICKS_PER_SECOND = 15;
const CHEAT_THRESHOLD = 3;

// ===== DOM ELEMENTS =====
const button = document.getElementById('zdkButton');
const countDisplay = document.getElementById('clickCount');
const bonusDisplay = document.getElementById('bonusAmount');
const prestigeDisplay = document.getElementById('prestigeLevel');
const titleScreen = document.getElementById('titleScreen');
const startButton = document.getElementById('startButton');
const playerNameInput = document.getElementById('playerNameInput');
const windowEl = document.getElementById('window');
const celestial = document.getElementById('celestial');
const lampShade = document.getElementById('lampShade');
const lampLight = document.getElementById('lampLight');
const windowLight = document.getElementById('windowLight');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuPanel = document.getElementById('menuPanel');
const closeMenu = document.getElementById('closeMenu');
const withdrawBtn = document.getElementById('withdrawBtn');
const shareBtn = document.getElementById('shareBtn');
const achievementsBtn = document.getElementById('achievementsBtn');
const prestigeBtn = document.getElementById('prestigeBtn');
const helpBtn = document.getElementById('helpBtn');
const statsBtn = document.getElementById('statsBtn');
const paskiBtn = document.getElementById('paskiBtn');
const mailboxBtn = document.getElementById('mailboxBtn');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
const achievementsPanel = document.getElementById('achievementsPanel');
const closeAchievements = document.getElementById('closeAchievements');
const achievementsList = document.getElementById('achievementsList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');
const mailboxPanel = document.getElementById('mailboxPanel');
const closeMailbox = document.getElementById('closeMailbox');
const mailList = document.getElementById('mailList');
const mailView = document.getElementById('mailView');
const menuNotification = document.getElementById('menuNotification');
const mailBadge = document.getElementById('mailBadge');
const loadingModal = document.getElementById('loadingModal');
const achievementNotification = document.getElementById('achievementNotification');
const notifAchievementName = document.getElementById('notifAchievementName');
const notifAchievementIcon = document.getElementById('notifAchievementIcon');
const bgMusic = document.getElementById('bgMusic');

// ===== MUSIC SYSTEM =====
function initMusic() {
    const savedMuteState = localStorage.getItem('zdkMusicMuted');
    if (savedMuteState === 'true') {
        isMusicMuted = true;
        bgMusic.muted = true;
        musicIcon.textContent = '🔇';
    } else {
        isMusicMuted = false;
        bgMusic.muted = false;
        musicIcon.textContent = '🔊';
    }
    bgMusic.volume = 0.3;
}

function toggleMusic() {
    isMusicMuted = !isMusicMuted;
    bgMusic.muted = isMusicMuted;

    if (isMusicMuted) {
        musicIcon.textContent = '🔇';
    } else {
        musicIcon.textContent = '🔊';
        bgMusic.play().catch(e => console.log('Music play blocked:', e));
    }

    localStorage.setItem('zdkMusicMuted', isMusicMuted);
}

function startBackgroundMusic() {
    if (!isMusicMuted) {
        bgMusic.play().catch(e => {
            console.log('Music autoplay blocked. Will try after first click.', e);
        });
    }
}

// ===== ACHIEVEMENTS DATA =====
const achievements = [
    { id: 'first', name: 'Pierwszy krok', desc: 'Kliknij pierwszy raz', icon: '👶', threshold: 1 },
    { id: 'novice', name: 'Nowicjusz', desc: 'Kliknij 50 razy', icon: '🔰', threshold: 50 },
    { id: 'worker', name: 'Pracowity', desc: 'Kliknij 100 razy', icon: '💼', threshold: 100 },
    { id: 'dedicated', name: 'Oddany', desc: 'Kliknij 250 razy', icon: '🎯', threshold: 250 },
    { id: 'expert', name: 'Ekspert', desc: 'Kliknij 500 razy', icon: '⭐', threshold: 500 },
    { id: 'slave', name: 'Klikalny niewolnik', desc: 'Kliknij 1000 razy', icon: '⛓️', threshold: 1000 },
    { id: 'addict', name: 'Uzależniony', desc: 'Kliknij 2500 razy', icon: '🔥', threshold: 2500 },
    { id: 'legend', name: 'Legenda', desc: 'Kliknij 5000 razy', icon: '👑', threshold: 5000 },
    { id: 'god', name: 'Bóg Klikania', desc: 'Kliknij 10000 razy', icon: '🌟', threshold: 10000 }
];

// ===== MESSAGES DATA =====
const messages = [
    {
        id: 1,
        from: '✨ Management Board',
        subject: 'KOMUNIKAT: Tymczasowa niedostępność modułu Patyki',
        preview: 'Szanowni Klikacze, informujemy o planowanych pracach...',
        body: `<p><strong>Do: Wszyscy Pracownicy</strong><br>
               <strong>Od: Management Board</strong><br>
               <strong>Priorytet: BARDZO NISKI</strong></p>
               
               <p>Szanowni Klikacze,</p>
               <p>W związku z implementacją nowego systemu analitycznego <strong>"Patyki 2.0"</strong>, z przykrością informujemy, że moduł statystyk będzie tymczasowo niedostępny.</p>
               
               <p><strong>📊 Status:</strong><br>
               Wysypały się</p>
               
               <p><strong>🔍 Co to są "Patyki"?</strong><br>
               Patyki to zaawansowany system business intelligence, który pozwala na real-time monitoring KPI, benchmarking względem innych zespołów oraz deep-dive analysis Twojej produktywności. Dzięki zastosowaniu machine learning i predictive analytics, będziesz mógł zoptymalizować swoje click-through rate.</p>
               
               <p><strong>⚠️ Komunikat techniczny:</strong><br>
               Próby dostępu do modułu Patyki będą skutkować komunikatem błędu. Jest to zachowanie zgodne z naszą polityką graceful degradation. Przepraszamy za wszelkie niedogodności związane z tym temporary downtime.</p>
               
               <p>Pozostajemy do dyspozycji w przypadku jakichkolwiek concerns.</p>
               
               <p style="margin-top:25px; padding-top:20px; border-top:2px solid rgba(59,130,246,0.3);">
               <em>Best regards,</em><br>
               <strong>Management Board</strong><br>
               <span style="font-size:11px; opacity:0.7;">ZDK Corporation™ | Synergy Through Innovation</span></p>`,
        date: new Date().toLocaleDateString('pl-PL'),
        read: false
    },
    {
        id: 2,
        from: '⚡ Bóg Prądu',
        subject: 'Dziwne ruchy w systemie - reset dla wszystkich',
        preview: 'Zauważyliśmy dziwne rzeczy w systemie kliknięć...',
        body: `<p><strong>Do: Wszyscy Pracownicy</strong><br>
               <strong>Od: Bóg Prądu</strong><br>
               <strong>Data: ${new Date().toLocaleDateString('pl-PL')}</strong></p>
               
               <p style="font-size:18px; margin:25px 0;">Cześć Zespół! 👋</p>
               
               <p>Mam dla Was nie do końca dobre wieści. W ostatnim czasie zauważyliśmy <strong>dziwne ruchy</strong> w naszym systemie śledzenia kliknięć.</p>
               
               <p><strong>Co się dzieje?</strong><br>
               Pojawiły się podejrzane wzorce aktywności - ktoś (albo kilka osób) klika <em>dziwnie szybko</em>. Nie mówimy tu o super zdolnościach manualnych, tylko o czymś... nienaturalnym. 🤔</p>
               
               <p style="background:rgba(255,215,0,0.1); padding:15px; border-left:4px solid #ffd700; margin:20px 0;">
               <strong>🔍 Problem:</strong><br>
               Nie wiemy <strong>kto dokładnie</strong> kombinuje. System widzi tylko dziwne liczby, ale nie potrafi wskazać palcem konkretnej osoby.
               </p>
               
               <p><strong>Co robimy?</strong><br>
               Po długich naradach z zarządem doszliśmy do wniosku, że <strong>najsprawiedliwiej będzie wyzerować wyniki wszystkim</strong>. Tak, wiem - trochę to niesprawiedliwe dla tych, którzy grali uczciwie. Ale inaczej byłoby jeszcze gorzej - nie możemy pozwolić żeby ktoś miał nieuczciwą przewagę.</p>
               
               <p style="background:rgba(255,107,107,0.1); padding:15px; border-left:4px solid #ff6b6b; margin:20px 0;">
               <strong>⚠️ Co się stanie:</strong><br><br>
               Wszystkim graczom zresetujemy:<br>
               • Licznik kliknięć<br>
               • Premie<br>
               • Osiągnięcia<br>
               • Poziom prestige<br>
               <br>
               Wszyscy wracamy do <strong>punktu startu</strong>. Czysta karta. 🔄
               </p>
               
               <p><strong>Dlaczego wszyscy?</strong><br>
               Bo to jedyna uczciwa opcja. Jeśli nie wiemy kto oszukiwał, nie możemy karać losowo. A pozostawienie obecnych wyników byłoby niesprawiedliwe wobec tych, którzy grali fair. Więc... przepraszam, ale reset dla wszystkich.</p>
               
               <p style="color:#ffd700; background:rgba(255,215,0,0.1); padding:15px; border-left:4px solid #ffd700; margin:20px 0;">
               <strong>💪 Dobra wiadomość:</strong><br>
               Od teraz system będzie <strong>pilnował</strong> żeby takie dziwne ruchy się nie powtarzały. Jeśli ktoś znowu spróbuje kombinować - system to wyłapie i będzie koniec zabawy dla tej osoby.
               </p>
               
               <p><strong>Co dalej?</strong><br>
               Wszyscy zaczynamy od zera. To będzie <strong>fair start</strong> dla każdego. Gramy uczciwie, bez żadnych sztuczek. Niech wygra najlepszy (i najbardziej wytrwały) klikacz! 🏆</p>
               
               <p>Wiem że to frustrujące dla tych z Was, którzy włożyli w to dużo pracy. Naprawdę przykro mi. Ale lepiej wszyscy od nowa niż pozwolić komuś kombinować. Rozumiecie? 🙏</p>
               
               <p style="font-size:13px; opacity:0.7; margin-top:30px; padding-top:20px; border-top:2px solid rgba(255,215,0,0.3);">
               <strong>PS:</strong> Jeśli to Ty kombinowałeś/aś - teraz masz drugą szansę. Graj fair. System patrzy. ⚡
               </p>
               
               <p style="margin-top:30px; padding-top:20px; border-top:2px solid rgba(59,130,246,0.3);">
               <strong>⚡ Bóg Prądu</strong><br>
               <span style="font-size:12px; opacity:0.7;">Ten co pilnuje porządku w systemie</span><br>
               <span style="font-size:11px; opacity:0.5; font-style:italic;">"Gramy fair albo wcale"</span>
               </p>`,
        date: new Date().toLocaleDateString('pl-PL'),
        read: false,
        isSystemMessage: true
    }
];

// ===== TIME OF DAY SYSTEM =====
const timesOfDay = [
    {
        name: 'Świt',
        sky: 'linear-gradient(to bottom, #1a1c2c 0%, #5d275d 30%, #b13e53 60%, #ef7d57 80%, #ffcd75 100%)',
        celestialColor: '#ffeb3b',
        celestialTop: '70%',
        celestialSize: '40px',
        wall: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
        floor: '#1a202c',
        windowLightOpacity: 0.15,
        lampOn: false
    },
    {
        name: 'Ranek',
        sky: 'linear-gradient(to bottom, #5dade2 0%, #85c1e9 40%, #a9cce3 100%)',
        celestialColor: '#ffeb3b',
        celestialTop: '50%',
        celestialSize: '50px',
        wall: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        floor: '#374151',
        windowLightOpacity: 0.35,
        lampOn: false
    },
    {
        name: 'Południe',
        sky: 'linear-gradient(to bottom, #3498db 0%, #5dade2 50%, #85c1e9 100%)',
        celestialColor: '#fff700',
        celestialTop: '20%',
        celestialSize: '55px',
        wall: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        floor: '#4a5568',
        windowLightOpacity: 0.5,
        lampOn: false
    },
    {
        name: 'Popołudnie',
        sky: 'linear-gradient(to bottom, #f39c12 0%, #e67e22 50%, #d35400 100%)',
        celestialColor: '#ffa500',
        celestialTop: '45%',
        celestialSize: '50px',
        wall: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        floor: '#4a3535',
        windowLightOpacity: 0.4,
        lampOn: false
    },
    {
        name: 'Zmierzch',
        sky: 'linear-gradient(to bottom, #2c3e50 0%, #8e44ad 30%, #e74c3c 60%, #f39c12 100%)',
        celestialColor: '#ff6b6b',
        celestialTop: '75%',
        celestialSize: '45px',
        wall: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        floor: '#2d3748',
        windowLightOpacity: 0.2,
        lampOn: false
    },
    {
        name: 'Wieczór',
        sky: 'linear-gradient(to bottom, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        celestialColor: '#e8e8e8',
        celestialTop: '35%',
        celestialSize: '45px',
        wall: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        floor: '#0f172a',
        windowLightOpacity: 0.05,
        lampOn: true
    },
    {
        name: 'Noc',
        sky: 'linear-gradient(to bottom, #000000 0%, #0a0e27 50%, #16213e 100%)',
        celestialColor: '#f0f0f0',
        celestialTop: '25%',
        celestialSize: '50px',
        wall: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        floor: '#0f0f1e',
        windowLightOpacity: 0,
        lampOn: true
    }
];

// ===== AUDIO SYSTEM =====
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound() {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
}

function playAchievementSound() {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.value = 523.25;
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    osc.start(audioContext.currentTime);

    setTimeout(() => {
        osc.frequency.value = 659.25;
    }, 100);

    setTimeout(() => {
        osc.frequency.value = 783.99;
    }, 200);

    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    osc.stop(audioContext.currentTime + 0.5);
}

// ===== ANTI-CHEAT SYSTEM =====
function detectCheating() {
    const now = Date.now();
    const timeDiff = now - lastClickTime;

    if (timeDiff > 1000) {
        clicksInSecond = 1;
    } else {
        clicksInSecond++;
    }

    lastClickTime = now;

    if (clicksInSecond > MAX_CLICKS_PER_SECOND) {
        suspiciousActivity++;

        if (suspiciousActivity >= CHEAT_THRESHOLD) {
            triggerAntiCheat();
            return true;
        }
    }

    return false;
}

function triggerAntiCheat() {
    if (isCheater) return;

    isCheater = true;

    stopButtonMovement();
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';

    showCheatDetectedModal();
}

function showCheatDetectedModal() {
    modalTitle.textContent = '🚨 WYKRYTO NIEAUTORYZOWANĄ AKTYWNOŚĆ';
    modalText.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <div style="font-size:64px; margin-bottom:20px;">⚡</div>
            <p style="font-size:20px; margin-bottom:15px; color:#ff6b6b;"><strong>ANTI-CHEAT SYSTEM ACTIVATED</strong></p>
            <p style="margin-bottom:20px;">Wykryto <strong>automated clicking</strong> przekraczające możliwości człowieka.</p>
            <p style="opacity:0.8; font-size:14px; margin-bottom:20px;">
                Click velocity: <strong>${clicksInSecond} clicks/second</strong><br>
                Threshold: ${MAX_CLICKS_PER_SECOND} clicks/second<br>
                Status: <span style="color:#ff6b6b;">VIOLATION DETECTED</span>
            </p>
            <p style="margin-bottom:15px;">📧 Sprawdź swoją <strong>skrzynkę pocztową</strong> w celu uzyskania dalszych informacji.</p>
            <p style="font-size:12px; opacity:0.6; font-style:italic;">Komunikat od Boga Prądu czeka na Ciebie...</p>
        </div>
    `;

    readMessages.delete(2);
    updateUnreadBadge();

    menuNotification.style.animation = 'pulse 0.5s infinite';

    modal.classList.add('show');
}

function resetGameProgress() {
    clickCount = 0;
    bonusAmount = 0;
    prestigeLevel = 0;
    buttonSpeed = 1;
    currentTimeIndex = 0;
    unlockedAchievements.clear();
    seenTimes.clear();
    suspiciousActivity = 0;
    isCheater = false;

    countDisplay.textContent = '0';
    bonusDisplay.textContent = '0.00';
    prestigeDisplay.textContent = '0';

    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';

    updateAchievementsList();
    updatePrestigeButton();
    updateTimeOfDay();

    localStorage.removeItem('zdkGameState');

    startButtonMovement();

    saveGame();
}

// ===== GAME LOGIC =====
function getPrestigeMultiplier() {
    return 1 + (prestigeLevel * 0.1);
}

function loadGame() {
    const saved = localStorage.getItem('zdkGameState');
    if (saved) {
        const state = JSON.parse(saved);
        clickCount = state.clicks || 0;
        bonusAmount = state.bonus || 0;
        prestigeLevel = state.prestige || 0;
        playerName = state.playerName || '';
        buttonSpeed = state.speed || 1;
        currentTimeIndex = state.timeIndex || 0;
        unlockedAchievements = new Set(state.achievements || []);
        seenTimes = new Set(state.seenTimes || []);
        readMessages = new Set(state.readMessages || []);

        countDisplay.textContent = clickCount;
        bonusDisplay.textContent = bonusAmount.toFixed(2);
        prestigeDisplay.textContent = prestigeLevel;
        if (playerName) playerNameInput.value = playerName;

        updateTimeOfDay();
        updateAchievementsList();
        updatePrestigeButton();
        updateUnreadBadge();
    }
}

function saveGame() {
    const state = {
        clicks: clickCount,
        bonus: bonusAmount,
        prestige: prestigeLevel,
        playerName: playerName,
        speed: buttonSpeed,
        timeIndex: currentTimeIndex,
        achievements: Array.from(unlockedAchievements),
        seenTimes: Array.from(seenTimes),
        readMessages: Array.from(readMessages)
    };
    localStorage.setItem('zdkGameState', JSON.stringify(state));
}

function updatePrestigeButton() {
    const canPrestige = clickCount >= 10000;
    prestigeBtn.disabled = !canPrestige;
    prestigeBtn.textContent = canPrestige ?
        `⭐ (+${(getPrestigeMultiplier() * 0.1 * 100 + 10).toFixed(0)}%)` :
        `⭐ (${clickCount}/10000)`;
}

function checkAchievements() {
    achievements.forEach(ach => {
        if (unlockedAchievements.has(ach.id)) return;
        if (ach.threshold && clickCount >= ach.threshold) {
            unlockedAchievements.add(ach.id);
            showAchievementNotification(ach);
            updateAchievementsList();
            saveGame();
        }
    });
}

function showAchievementNotification(achievement) {
    notifAchievementName.textContent = achievement.name;
    notifAchievementIcon.textContent = achievement.icon;
    achievementNotification.classList.add('show');
    playAchievementSound();

    setTimeout(() => {
        achievementNotification.classList.remove('show');
    }, 3000);
}

function updateAchievementsList() {
    achievementsList.innerHTML = '';
    achievements.forEach(ach => {
        const unlocked = unlockedAchievements.has(ach.id);
        const item = document.createElement('div');
        item.className = 'achievement-item' + (unlocked ? ' unlocked' : '');
        const progress = ach.threshold ? `${Math.min(clickCount, ach.threshold)}/${ach.threshold}` : '';
        item.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
            <div class="achievement-progress">${unlocked ? '✓ Odblokowane' : progress}</div>
        `;
        achievementsList.appendChild(item);
    });
}

function updateTimeOfDay() {
    const time = timesOfDay[currentTimeIndex];
    windowEl.style.background = time.sky;
    celestial.style.background = time.celestialColor;
    celestial.style.top = time.celestialTop;
    celestial.style.width = time.celestialSize;
    celestial.style.height = time.celestialSize;
    document.querySelector('.wall').style.background = time.wall;
    document.querySelector('.floor').style.background = time.floor;
    windowLight.style.opacity = time.windowLightOpacity;

    if (time.lampOn) {
        lampShade.classList.remove('off');
        lampLight.classList.remove('off');
    } else {
        lampShade.classList.add('off');
        lampLight.classList.add('off');
    }

    seenTimes.add(currentTimeIndex);
    checkAchievements();
}

// ===== BUTTON MOVEMENT - CONTINUOUS SMOOTH MOVEMENT =====
function moveButton() {
    const margin = 30;
    const maxAttempts = 100;
    let newX, newY;
    let attempts = 0;
    let validPosition = false;

    while (!validPosition && attempts < maxAttempts) {
        newX = Math.random() * (window.innerWidth - button.offsetWidth - margin * 2) + margin;
        newY = Math.random() * (window.innerHeight - button.offsetHeight - margin * 2) + margin;

        const uiBox = document.getElementById('uiContainer').getBoundingClientRect();
        const musicBtnBox = document.getElementById('musicToggleBtn').getBoundingClientRect();
        const buttonRect = {
            left: newX,
            top: newY,
            right: newX + button.offsetWidth,
            bottom: newY + button.offsetHeight
        };

        // Check collision with UI and music button
        const uiCollision = !(buttonRect.right < uiBox.left ||
            buttonRect.left > uiBox.right ||
            buttonRect.bottom < uiBox.top ||
            buttonRect.top > uiBox.bottom);

        const musicCollision = !(buttonRect.right < musicBtnBox.left ||
            buttonRect.left > musicBtnBox.right ||
            buttonRect.bottom < musicBtnBox.top ||
            buttonRect.top > musicBtnBox.bottom);

        if (!uiCollision && !musicCollision) {
            validPosition = true;
        }
        attempts++;
    }

    // Calculate speed based on button speed level - smooth continuous movement
    const transitionTime = Math.max(2, 5 - (buttonSpeed - 1) * 0.3);
    button.style.transition = `all ${transitionTime}s linear`;
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
}

function startButtonMovement() {
    if (moveButtonInterval) {
        clearInterval(moveButtonInterval);
    }

    // Move continuously - interval determines how often to pick a new destination
    const moveInterval = Math.max(2000, 5000 - (buttonSpeed - 1) * 200);

    // Initial move
    moveButton();

    moveButtonInterval = setInterval(() => {
        moveButton();
    }, moveInterval);
}

function stopButtonMovement() {
    if (moveButtonInterval) {
        clearInterval(moveButtonInterval);
        moveButtonInterval = null;
    }
}

// ===== MAIL SYSTEM =====
function updateUnreadBadge() {
    const unreadCount = messages.filter(m => !readMessages.has(m.id)).length;
    if (unreadCount > 0) {
        menuNotification.textContent = unreadCount;
        menuNotification.style.display = 'flex';
        mailBadge.textContent = unreadCount;
        mailBadge.style.display = 'inline-block';
    } else {
        menuNotification.style.display = 'none';
        mailBadge.style.display = 'none';
    }
}

function renderMailList() {
    mailList.innerHTML = '';
    messages.forEach(msg => {
        const isUnread = !readMessages.has(msg.id);
        const isSystem = msg.isSystemMessage;
        const mailItem = document.createElement('div');
        mailItem.className = 'mail-item' +
            (isUnread ? ' unread' : '') +
            (isSystem && isUnread ? ' system-message' : '');
        mailItem.innerHTML = `
            <div class="mail-indicator"></div>
            <div class="mail-info">
                <div class="mail-from">${msg.from}</div>
                <div class="mail-subject">${msg.subject}</div>
                <div class="mail-preview">${msg.preview}</div>
            </div>
        `;
        mailItem.addEventListener('click', () => openMail(msg));
        mailList.appendChild(mailItem);
    });
}

function openMail(msg) {
    readMessages.add(msg.id);
    updateUnreadBadge();
    saveGame();

    const isGodMessage = msg.id === 2;

    mailView.innerHTML = `
        <button class="mail-back" id="mailBackBtn">← Powrót</button>
        <div class="mail-subject-view">${msg.subject}</div>
        <div class="mail-body">${msg.body}</div>
        ${isGodMessage ? `
            <div style="margin-top:30px; text-align:center; padding:20px; background:rgba(255,107,107,0.1); border-radius:10px;">
                <p style="font-size:18px; font-weight:bold; margin-bottom:15px; color:#ff6b6b;">⚠️ WYMAGANA AKCJA</p>
                <p style="margin-bottom:20px; opacity:0.9;">Kliknij poniżej aby potwierdzić zrozumienie i rozpocząć od nowa.</p>
                <button id="confirmReset" style="padding:15px 40px; font-size:18px; background:#ff6b6b; color:white; border:3px solid #c92a2a; border-radius:10px; cursor:pointer; font-family:inherit; font-weight:bold;">
                    ⚡ Rozumiem i akceptuję reset
                </button>
            </div>
        ` : ''}
    `;

    mailList.style.display = 'none';
    mailView.classList.add('active');

    document.getElementById('mailBackBtn').addEventListener('click', () => {
        mailView.classList.remove('active');
        mailList.style.display = 'flex';
        renderMailList();
    });

    if (isGodMessage) {
        document.getElementById('confirmReset').addEventListener('click', () => {
            loadingModal.classList.add('show');

            setTimeout(() => {
                resetGameProgress();
                loadingModal.classList.remove('show');
                mailboxPanel.classList.remove('open');
                // NO CONFIRMATION MODAL - user requested removal
            }, 2000);
        });
    }
}

// ===== SHARE SYSTEM =====
function generateShareImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const wallGradient = ctx.createLinearGradient(0, 0, 600, 640);
    wallGradient.addColorStop(0, '#667eea');
    wallGradient.addColorStop(0.5, '#764ba2');
    wallGradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = wallGradient;
    ctx.fillRect(0, 0, 600, 640);

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 640, 600, 160);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('KLIKAM WIĘC JESTEM', 300, 100);
    ctx.shadowBlur = 0;

    if (playerName) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(150, 150, 300, 60);
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 32px "Courier New"';
        ctx.fillText(playerName, 300, 190);
    }

    let achievementTitle = '';
    let achievementIcon = '';
    if (clickCount >= 10000) {
        achievementTitle = 'Bóg Klikania';
        achievementIcon = '🌟';
    } else if (clickCount >= 5000) {
        achievementTitle = 'Legenda';
        achievementIcon = '👑';
    } else if (clickCount >= 2500) {
        achievementTitle = 'Uzależniony';
        achievementIcon = '🔥';
    } else if (clickCount >= 1000) {
        achievementTitle = 'Klikalny niewolnik';
        achievementIcon = '⛓️';
    } else if (clickCount >= 500) {
        achievementTitle = 'Ekspert';
        achievementIcon = '⭐';
    } else if (clickCount >= 250) {
        achievementTitle = 'Oddany';
        achievementIcon = '🎯';
    } else if (clickCount >= 100) {
        achievementTitle = 'Pracowity';
        achievementIcon = '💼';
    } else if (clickCount >= 50) {
        achievementTitle = 'Nowicjusz';
        achievementIcon = '🔰';
    } else if (clickCount >= 1) {
        achievementTitle = 'Pierwszy krok';
        achievementIcon = '👶';
    }

    if (achievementTitle) {
        ctx.fillStyle = '#f093fb';
        ctx.font = 'bold 24px "Courier New"';
        ctx.fillText(`${achievementIcon} ${achievementTitle}`, 300, 240);
    }

    const centerY = 380;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(75, centerY - 80, 150, 110);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.strokeRect(75, centerY - 80, 150, 110);
    ctx.fillStyle = '#00ff88';
    ctx.font = '28px "Courier New"';
    ctx.fillText('💼', 150, centerY - 45);
    ctx.font = 'bold 32px "Courier New"';
    ctx.fillText(clickCount.toString(), 150, centerY - 5);
    ctx.font = '14px "Courier New"';
    ctx.fillText('kliknięć', 150, centerY + 18);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(225, centerY - 80, 150, 110);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.strokeRect(225, centerY - 80, 150, 110);
    ctx.fillStyle = '#ffd700';
    ctx.font = '28px "Courier New"';
    ctx.fillText('💰', 300, centerY - 45);
    ctx.font = 'bold 28px "Courier New"';
    ctx.fillText(bonusAmount.toFixed(0) + ' zł', 300, centerY - 5);
    ctx.font = '14px "Courier New"';
    ctx.fillText('premia', 300, centerY + 18);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(375, centerY - 80, 150, 110);
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.strokeRect(375, centerY - 80, 150, 110);
    ctx.fillStyle = '#667eea';
    ctx.font = '28px "Courier New"';
    ctx.fillText('⭐', 450, centerY - 45);
    ctx.font = 'bold 32px "Courier New"';
    ctx.fillText(prestigeLevel.toString(), 450, centerY - 5);
    ctx.font = '14px "Courier New"';
    ctx.fillText('prestige', 450, centerY + 18);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '18px "Courier New"';
    ctx.fillText('klikam-wiec-jestem.netlify.app', 300, 740);

    canvas.toBlob(blob => {
        const file = new File([blob], 'zdk-wyniki.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                files: [file]
            }).catch(() => {
                downloadImage(canvas);
            });
        } else {
            downloadImage(canvas);
        }
    });
}

function downloadImage(canvas) {
    const link = document.createElement('a');
    link.download = 'zdk-wyniki.png';
    link.href = canvas.toDataURL();
    link.click();

    modalTitle.textContent = '📸 Zrzut ekranu zapisany!';
    modalText.textContent = 'Twoje wyniki zostały zapisane jako obraz.';
    modal.classList.add('show');
}

// ===== EVENT LISTENERS =====

// Button click
button.addEventListener('click', (e) => {
    // Try to start music on first interaction if it hasn't started
    if (bgMusic.paused && !isMusicMuted) {
        bgMusic.play().catch(e => console.log('Music play blocked:', e));
    }

    if (detectCheating()) {
        return;
    }

    clickCount++;
    countDisplay.textContent = clickCount;
    playClickSound();

    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);

    // Jump to new position immediately on click
    button.style.transition = 'all 0.1s ease';
    const margin = 30;
    let newX = Math.random() * (window.innerWidth - button.offsetWidth - margin * 2) + margin;
    let newY = Math.random() * (window.innerHeight - button.offsetHeight - margin * 2) + margin;
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';

    // Resume smooth movement after jump
    setTimeout(() => {
        moveButton();
    }, 100);

    if (clickCount % 100 === 0) {
        bonusAmount += 2.09 * getPrestigeMultiplier();
        bonusDisplay.textContent = bonusAmount.toFixed(2);
        buttonSpeed++;

        stopButtonMovement();
        startButtonMovement();
    }

    if (clickCount % 20 === 0) {
        currentTimeIndex = (currentTimeIndex + 1) % timesOfDay.length;
        updateTimeOfDay();
    }

    checkAchievements();
    updatePrestigeButton();
    saveGame();
});

// Music toggle button
musicToggleBtn.addEventListener('click', toggleMusic);

// Withdraw button
withdrawBtn.addEventListener('click', () => {
    if (bonusAmount === 0) {
        modalTitle.textContent = '💸 Brak premii';
        modalText.textContent = 'Jeszcze za mało kliknięć! Pracuj dalej, aby uzbierać premię.';
    } else {
        const deductionsPool = [
            'Opłata za zbyt długie oddychanie przy biurku',
            'Składka na Program Pozytywnego Myślenia',
            'Podatek od zaangażowania powyżej normy',
            'Wyrównanie motywacyjne międzydziałowe',
            'Opłata środowiskowa za użycie klimatyzacji',
            'Koszt implementacji nowej platformy benefitowej',
            'Składka na rezerwę strategiczną KPI',
            'Dopłata za nadmierne wykorzystanie przycisku „Wyślij" w Outlooku',
            'Opłata za niewystarczający entuzjazm w czasie daily',
            'Dopłata za uśmiech w godzinach nadliczbowych',
            'Opłata za udział w nieobowiązkowym webinarze',
            'Koszt wdrożenia programu Work Smarter, Not Harder',
            'Fundusz Innowacji: pomysły, które nie przeszły przez akceptację',
            'Składka wyrównawcza po integracji zespołowej',
            'Abonament na monitorowanie satysfakcji pracowników'
        ];

        const chosen = [];
        const poolCopy = [...deductionsPool];
        const count = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count && poolCopy.length > 0; i++) {
            const idx = Math.floor(Math.random() * poolCopy.length);
            chosen.push(poolCopy.splice(idx, 1)[0]);
        }

        const deductions = chosen.map((name, i) => ({
            name,
            amount: (bonusAmount / chosen.length) * (0.8 + Math.random() * 0.4)
        }));

        modalTitle.textContent = '📉 Raport korekty premii jakościowej';
        modalText.innerHTML = `
            <strong>Twoja premia jakościowa: ${bonusAmount.toFixed(2)} zł</strong><br><br>
            Wykryto następujące automatyczne potrącenia:<br><br>
            ${deductions.map(d => `• ${d.name}: -${d.amount.toFixed(2)} zł`).join('<br>')}
            <br><br>
            <strong style="color:#ff6b6b; font-size:22px;">Do wypłaty: 0.00 zł</strong>
            <br><br>
            <span style="opacity:0.7; font-size:14px;">Dziękujemy za zaangażowanie — system już je skorygował.</span>
        `;

        bonusAmount = 0;
        bonusDisplay.textContent = '0.00';
        saveGame();
    }
    modal.classList.add('show');
    menuPanel.classList.remove('open');
});

// Share button
shareBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    generateShareImage();
});

// Prestige button
prestigeBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    if (clickCount >= 10000) {
        modalTitle.textContent = '⭐ Prestige';
        modalText.innerHTML = `<strong>Czy na pewno chcesz wykonać Prestige?</strong><br><br>
            Reset:<br>• Kliknięcia: 0<br>• Premia: 0 zł<br>• Szybkość: 1<br><br>
            Zachowasz:<br>• Osiągnięcia<br>• Poziom Prestige +1<br><br>
            <strong style="color:#00ff88">Bonus: +10% premii na zawsze!</strong><br><br>
            <button id="confirmPrestige" style="margin:10px;padding:15px 30px;font-size:18px;background:#667eea;color:white;border:3px solid #4a5fbb;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:bold">✓ Tak!</button>
            <button id="cancelPrestige" style="margin:10px;padding:15px 30px;font-size:18px;background:#ff6b6b;color:white;border:3px solid #c92a2a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:bold">✗ Anuluj</button>`;
        modal.classList.add('show');

        document.getElementById('confirmPrestige').addEventListener('click', () => {
            prestigeLevel++;
            clickCount = bonusAmount = buttonSpeed = 0;
            currentTimeIndex = 0;
            countDisplay.textContent = '0';
            bonusDisplay.textContent = '0.00';
            prestigeDisplay.textContent = prestigeLevel;

            stopButtonMovement();
            startButtonMovement();

            updateTimeOfDay();
            updatePrestigeButton();
            saveGame();
            modal.classList.remove('show');
        });

        document.getElementById('cancelPrestige').addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
});

// Menu buttons
achievementsBtn.addEventListener('click', () => {
    achievementsPanel.classList.add('open');
    menuPanel.classList.remove('open');
});

closeAchievements.addEventListener('click', () => achievementsPanel.classList.remove('open'));

hamburgerBtn.addEventListener('click', () => menuPanel.classList.add('open'));
closeMenu.addEventListener('click', () => menuPanel.classList.remove('open'));

// Stats button
statsBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    loadingModal.classList.add('show');

    setTimeout(() => {
        loadingModal.classList.remove('show');
        modalTitle.textContent = '❌ Błąd dostępu';
        modalText.innerHTML = `
            <div style="text-align:center">
                <div style="font-size:64px; margin-bottom:20px">📊</div>
                <p style="font-size:20px; margin-bottom:15px"><strong>Patyki niedostępne</strong></p>
                <p style="margin-bottom:20px; color:rgba(255,255,255,0.8);">
                    Spróbuj ponownie <strong>jutro</strong>.
                </p>
                <p style="font-size:12px; opacity:0.6; font-style:italic;">
                    Kod błędu: RICHMAN_IS_ON_ELQUATRO
                </p>
            </div>
        `;
        modal.classList.add('show');
    }, 2000);
});

// Paski button
paskiBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    loadingModal.classList.add('show');

    setTimeout(() => {
        loadingModal.classList.remove('show');
        modalTitle.textContent = '❌ Brak pasków';
        modalText.innerHTML = `
            <div style="text-align:center">
                <div style="font-size:64px; margin-bottom:20px">📈</div>
                <p style="font-size:24px; margin-bottom:15px"><strong>Nie ma pasków</strong></p>
            </div>
        `;
        modal.classList.add('show');
    }, 2000);
});

// Mailbox
mailboxBtn.addEventListener('click', () => {
    mailboxPanel.classList.add('open');
    menuPanel.classList.remove('open');
    renderMailList();
    mailList.style.display = 'flex';
    mailView.classList.remove('active');
});

closeMailbox.addEventListener('click', () => mailboxPanel.classList.remove('open'));

// Help
helpBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    modalTitle.textContent = '📖 Jak grać?';
    modalText.innerHTML = '<div style="text-align:center; font-size:18px; padding:20px;">Klikaj ZDK i się nie interesuj!</div>';
    modal.classList.add('show');
});

// Modal close
modalClose.addEventListener('click', () => {
    if (modalTitle.textContent.includes('NIEAUTORYZOWANĄ AKTYWNOŚĆ')) {
        mailboxPanel.classList.add('open');
        renderMailList();
        mailList.style.display = 'flex';
        mailView.classList.remove('active');
    }
    modal.classList.remove('show');
});

modal.addEventListener('click', e => {
    if (e.target === modal) {
        if (modalTitle.textContent.includes('NIEAUTORYZOWANĄ AKTYWNOŚĆ')) {
            mailboxPanel.classList.add('open');
            renderMailList();
            mailList.style.display = 'flex';
            mailView.classList.remove('active');
        }
        modal.classList.remove('show');
    }
});

// Start button
startButton.addEventListener('click', () => {
    const nameValue = playerNameInput.value.trim();
    if (nameValue) {
        playerName = nameValue;
        saveGame();
    }
    titleScreen.classList.add('hidden');
    setTimeout(() => titleScreen.style.display = 'none', 500);

    // Start smooth continuous movement
    startButtonMovement();
    updateTimeOfDay();

    // Start background music
    startBackgroundMusic();
});

// ===== INITIALIZATION =====
initMusic();
loadGame();
updateTimeOfDay();
updateAchievementsList();
updateUnreadBadge();
setInterval(saveGame, 5000);