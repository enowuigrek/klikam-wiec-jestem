// Zmienne gry
let clickCount = 0;
let bonusAmount = 0;
let prestigeLevel = 0;
let playerName = '';
let buttonSpeed = 1;
let currentTimeIndex = 0;
let unlockedAchievements = new Set();
let seenTimes = new Set();
let readMessages = new Set();

// Elementy DOM
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

// Osiągnięcia
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

// Wiadomości
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
    }
];

// Pory dnia - NOWY SYSTEM Z 7 PORAMI
const timesOfDay = [
    // 0 - Świt (Dawn)
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
    // 1 - Ranek (Morning)
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
    // 2 - Południe (Noon)
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
    // 3 - Popołudnie (Afternoon)
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
    // 4 - Zmierzch (Dusk)
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
    // 5 - Wieczór (Evening)
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
    // 6 - Noc (Night)
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

// Audio
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

// Funkcje pomocnicze
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
            updateAchievementsList();
            saveGame();
        }
    });
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

    // Aktualizacja nieba w oknie
    windowEl.style.background = time.sky;

    // Aktualizacja ciała niebieskiego (słońce/księżyc)
    celestial.style.background = time.celestialColor;
    celestial.style.top = time.celestialTop;
    celestial.style.width = time.celestialSize;
    celestial.style.height = time.celestialSize;

    // Aktualizacja ściany i podłogi
    document.querySelector('.wall').style.background = time.wall;
    document.querySelector('.floor').style.background = time.floor;

    // Obsługa światła z okna
    windowLight.style.opacity = time.windowLightOpacity;

    // Obsługa lampki
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

function moveButton() {
    const margin = 30;
    let x = Math.random() * (window.innerWidth - button.offsetWidth - margin * 2) + margin;
    let y = Math.random() * (window.innerHeight - button.offsetHeight - margin * 2) + margin;
    button.style.transition = `all ${Math.max(0.1, 0.5 - (buttonSpeed - 1) * 0.04)}s ease`;
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    button.style.transform = '';
}

// Funkcje poczty
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
        const mailItem = document.createElement('div');
        mailItem.className = 'mail-item' + (isUnread ? ' unread' : '');
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

    mailView.innerHTML = `
        <button class="mail-back" id="mailBackBtn">← Powrót</button>
        <div class="mail-subject-view">${msg.subject}</div>
        <div class="mail-body">${msg.body}</div>
    `;

    mailList.style.display = 'none';
    mailView.classList.add('active');

    document.getElementById('mailBackBtn').addEventListener('click', () => {
        mailView.classList.remove('active');
        mailList.style.display = 'flex';
        renderMailList();
    });
}

// Event Listeners
button.addEventListener('click', () => {
    clickCount++;
    countDisplay.textContent = clickCount;
    playClickSound();
    moveButton();

    if (clickCount % 100 === 0) {
        bonusAmount += 2.09 * getPrestigeMultiplier();
        bonusDisplay.textContent = bonusAmount.toFixed(2);
        buttonSpeed++;
    }

    if (clickCount % 20 === 0) {
        currentTimeIndex = (currentTimeIndex + 1) % timesOfDay.length;
        updateTimeOfDay();
    }

    checkAchievements();
    updatePrestigeButton();
    saveGame();
});

// ---
withdrawBtn.addEventListener('click', () => {
    if (bonusAmount === 0) {
        modalTitle.textContent = '💸 Brak premii';
        modalText.textContent = 'Jeszcze za mało kliknięć! Pracuj dalej, aby uzbierać premię.';
    } else {
        // Absurdalne korpo-potrącenia
        const deductionsPool = [
            'Opłata za zbyt długie oddychanie przy biurku',
            'Składka na Program Pozytywnego Myślenia',
            'Podatek od zaangażowania powyżej normy',
            'Wyrównanie motywacyjne międzydziałowe',
            'Opłata środowiskowa za użycie klimatyzacji',
            'Koszt implementacji nowej platformy benefitowej',
            'Składka na rezerwę strategiczną KPI',
            'Dopłata za nadmierne wykorzystanie przycisku „Wyślij” w Outlooku',
            'Opłata za niewystarczający entuzjazm w czasie daily',
            'Dopłata za uśmiech w godzinach nadliczbowych',
            'Opłata za udział w nieobowiązkowym webinarze',
            'Koszt wdrożenia programu Work Smarter, Not Harder',
            'Fundusz Innowacji: pomysły, które nie przeszły przez akceptację',
            'Składka wyrównawcza po integracji zespołowej',
            'Abonament na monitorowanie satysfakcji pracowników'
        ];

        // Wybierz losowo kilka potrąceń
        const chosen = [];
        const poolCopy = [...deductionsPool];
        const count = 5 + Math.floor(Math.random() * 4); // 5–8 potrąceń
        for (let i = 0; i < count && poolCopy.length > 0; i++) {
            const idx = Math.floor(Math.random() * poolCopy.length);
            chosen.push(poolCopy.splice(idx, 1)[0]);
        }

        // Oblicz sztuczne potrącenia – zawsze do zera
        const deductions = chosen.map((name, i) => ({
            name,
            amount: (bonusAmount / chosen.length) * (0.8 + Math.random() * 0.4)
        }));

        const totalDeduction = deductions.reduce((sum, d) => sum + d.amount, 0);
        const remaining = Math.max(0, bonusAmount - totalDeduction);

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
function showPaymentForm() {
    modalTitle.textContent = '💳 Płatność - Ulga podatkowa';
    modalText.innerHTML = `
        <div style="text-align:left;max-width:400px;margin:0 auto">
            <p style="margin-bottom:20px;text-align:center">Kwota do zapłaty: <strong style="color:#00ff88">3000.00 zł</strong></p>

            <label style="display:block;margin-bottom:5px;font-size:14px">Numer karty:</label>
            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" style="width:100%;padding:12px;margin-bottom:15px;background:#2d3748;color:white;border:2px solid #667eea;border-radius:8px;font-family:inherit;font-size:16px">

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px">
                <div>
                    <label style="display:block;margin-bottom:5px;font-size:14px">Data ważności:</label>
                    <input type="text" id="cardExpiry" placeholder="MM/RR" maxlength="5" style="width:100%;padding:12px;background:#2d3748;color:white;border:2px solid #667eea;border-radius:8px;font-family:inherit;font-size:16px">
                </div>
                <div>
                    <label style="display:block;margin-bottom:5px;font-size:14px">CVV:</label>
                    <input type="text" id="cardCVV" placeholder="123" maxlength="3" style="width:100%;padding:12px;background:#2d3748;color:white;border:2px solid #667eea;border-radius:8px;font-family:inherit;font-size:16px">
                </div>
            </div>

            <label style="display:block;margin-bottom:5px;font-size:14px">Imię i nazwisko:</label>
            <input type="text" id="cardName" placeholder="Katarzyna Woźniak" style="width:100%;padding:12px;margin-bottom:20px;background:#2d3748;color:white;border:2px solid #667eea;border-radius:8px;font-family:inherit;font-size:16px">

            <button id="confirmPayment" style="width:100%;padding:15px;font-size:18px;background:#10b981;color:white;border:3px solid #047857;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:bold;margin-bottom:10px">✓ Zapłać 3000 zł</button>
            <button id="cancelPayment" style="width:100%;padding:12px;font-size:16px;background:#ff6b6b;color:white;border:3px solid #c92a2a;border-radius:10px;cursor:pointer;font-family:inherit">✗ Anuluj</button>

            <p style="margin-top:15px;font-size:12px;opacity:0.7;text-align:center">🔒 Bezpieczna płatność SSL 256-bit</p>
        </div>
    `;

    // Auto-format card number
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    // Auto-format expiry
    const expiryInput = document.getElementById('cardExpiry');
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0,2) + '/' + value.slice(2,4);
        }
        e.target.value = value;
    });

    document.getElementById('confirmPayment').addEventListener('click', () => {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        const cardName = document.getElementById('cardName').value;

        if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
            alert('Wypełnij wszystkie pola!');
            return;
        }

        // "Przetwarzanie"
        modalTitle.textContent = '⏳ Przetwarzanie płatności...';
        modalText.innerHTML = '<div style="text-align:center;padding:40px"><div style="font-size:48px;margin-bottom:20px">⏳</div><p>Łączymy z bankiem...</p></div>';

        setTimeout(() => {
            // TROLLING!
            modalTitle.textContent = '❌ Błąd płatności';
            modalText.innerHTML = `
                <div style="text-align:center;padding:20px">
                    <div style="font-size:64px;margin-bottom:20px">😅</div>
                    <p style="font-size:18px;margin-bottom:15px"><strong>Przepraszamy!</strong></p>
                    <p style="margin-bottom:20px">Wystąpił nieoczekiwany błąd podczas przetwarzania płatności.</p>
                    <p style="opacity:0.8;font-size:14px;margin-bottom:10px"><em>Kod błędu: TAX_EVASION_IMPOSSIBLE</em></p>
                    <p style="opacity:0.7;font-size:13px">Podatki w Polsce są nieuniknione. Witaj w rzeczywistości! 🇵🇱</p>
                </div>
            `;
        }, 2000);
    });

    document.getElementById('cancelPayment').addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

shareBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    generateShareImage();
});

function generateShareImage() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Wall gradient (80% height)
    const wallGradient = ctx.createLinearGradient(0, 0, 600, 640);
    wallGradient.addColorStop(0, '#667eea');
    wallGradient.addColorStop(0.5, '#764ba2');
    wallGradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = wallGradient;
    ctx.fillRect(0, 0, 600, 640);

    // Floor (20% height)
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 640, 600, 160);

    // Title on wall
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px "Courier New"';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('KLIKAM WIĘC JESTEM', 300, 100);
    ctx.shadowBlur = 0;

    // Player name box on wall
    if (playerName) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(150, 150, 300, 60);
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 32px "Courier New"';
        ctx.fillText(playerName, 300, 190);
    }

    // Achievement title based on clicks
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

    // Achievement title below name
    if (achievementTitle) {
        ctx.fillStyle = '#f093fb';
        ctx.font = 'bold 24px "Courier New"';
        ctx.fillText(`${achievementIcon} ${achievementTitle}`, 300, 240);
    }

    // Big stats display in center of wall
    const centerY = 380;

    // Clicks
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

    // Bonus
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

    // Prestige
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

    // Footer on floor
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '18px "Courier New"';
    ctx.fillText('klikam-wiec-jestem.netlify.app', 300, 740);

    // Convert to blob and share/download
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

prestigeBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    if (clickCount >= 10000) {
        modalTitle.textContent = '⭐ Prestige';
        modalText.innerHTML = '<strong>Czy na pewno chcesz wykonać Prestige?</strong><br><br>Reset:<br>• Kliknięcia: 0<br>• Premia: 0 zł<br>• Szybkość: 1<br><br>Zachowasz:<br>• Osiągnięcia<br>• Poziom Prestige +1<br><br><strong style="color:#00ff88">Bonus: +10% premii na zawsze!</strong><br><br><button id="confirmPrestige" style="margin:10px;padding:15px 30px;font-size:18px;background:#667eea;color:white;border:3px solid #4a5fbb;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:bold">✓ Tak!</button><button id="cancelPrestige" style="margin:10px;padding:15px 30px;font-size:18px;background:#ff6b6b;color:white;border:3px solid #c92a2a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:bold">✗ Anuluj</button>';
        modal.classList.add('show');

        document.getElementById('confirmPrestige').addEventListener('click', () => {
            prestigeLevel++;
            clickCount = bonusAmount = buttonSpeed = 0;
            currentTimeIndex = 0;
            countDisplay.textContent = '0';
            bonusDisplay.textContent = '0.00';
            prestigeDisplay.textContent = prestigeLevel;
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

achievementsBtn.addEventListener('click', () => {
    achievementsPanel.classList.add('open');
    menuPanel.classList.remove('open');
});
closeAchievements.addEventListener('click', () => achievementsPanel.classList.remove('open'));

// Hamburger menu
hamburgerBtn.addEventListener('click', () => menuPanel.classList.add('open'));
closeMenu.addEventListener('click', () => menuPanel.classList.remove('open'));

// Stats button (Patyki)
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

mailboxBtn.addEventListener('click', () => {
    mailboxPanel.classList.add('open');
    renderMailList();
    mailList.style.display = 'flex';
    mailView.classList.remove('active');
});

closeMailbox.addEventListener('click', () => mailboxPanel.classList.remove('open'));

helpBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    modalTitle.textContent = '📖 Jak grać?';
    modalText.innerHTML = '<div style="text-align:center; font-size:18px; padding:20px;">Klikaj ZDK i się nie interesuj!</div>';
    modal.classList.add('show');
});

modalClose.addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

startButton.addEventListener('click', () => {
    const nameValue = playerNameInput.value.trim();
    if (nameValue) {
        playerName = nameValue;
        saveGame();
    }
    titleScreen.classList.add('hidden');
    setTimeout(() => titleScreen.style.display = 'none', 500);
    moveButton();
    updateTimeOfDay();
});

// Inicjalizacja
loadGame();
updateTimeOfDay();
updateAchievementsList();
updateUnreadBadge();
setInterval(saveGame, 5000);