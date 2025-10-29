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

// Pory dnia
const timesOfDay = [
    { sky: '#87ceeb', celestialColor: '#ffeb3b', celestialTop: '45%', wall: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', floor: '#2d3748' },
    { sky: '#5dade2', celestialColor: '#ffeb3b', celestialTop: '15%', wall: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', floor: '#374151' },
    { sky: '#f39c12', celestialColor: '#ffa500', celestialTop: '40%', wall: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', floor: '#4a3535' }
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
    windowEl.style.background = time.sky;
    celestial.style.background = time.celestialColor;
    celestial.style.top = time.celestialTop;
    document.querySelector('.wall').style.background = time.wall;
    document.querySelector('.floor').style.background = time.floor;

    // Handle lamp for dark times
    if (currentTimeIndex >= 5) {
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

withdrawBtn.addEventListener('click', () => {
    if (bonusAmount === 0) {
        modalTitle.textContent = '💸 Brak premii';
        modalText.textContent = 'Jeszcze za mało kliknięć! Pracuj dalej, aby uzbierać premię.';
    } else {
        const taxes = [
            { name: 'PIT', amount: bonusAmount * 0.32 },
            { name: 'ZUS', amount: bonusAmount * 0.28 },
            { name: 'NFZ', amount: bonusAmount * 0.09 },
            { name: 'Składka zdrowotna', amount: bonusAmount * 0.12 },
            { name: 'Podatek od premii', amount: bonusAmount * 0.19 }
        ];
        const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0);
        const remaining = bonusAmount - totalTax;

        modalTitle.textContent = '💰 Wypłata premii';
        modalText.innerHTML = `<strong>Twoja premia: ${bonusAmount.toFixed(2)} zł</strong><br><br>Obowiązkowe odliczenia:<br>${taxes.map(tax => `• ${tax.name}: -${tax.amount.toFixed(2)} zł`).join('<br>')}<br><br><strong style="color: #ff6b6b; font-size: 24px;">Do wypłaty: ${Math.max(0, remaining).toFixed(2)} zł</strong><br><br>${remaining <= 0 ? `<span style="opacity: 0.7; font-size: 14px;">Niestety podatki pochłonęły całą premię...</span><br><br><button id="buyTaxRelief" style="margin-top:15px;padding:15px 30px;font-size:16px;background:linear-gradient(135deg,#10b981,#059669);color:white;border:3px solid #047857;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:bold;box-shadow:0 4px 15px rgba(16,185,129,0.4)">💳 Kup ulgę podatkową (3000 zł)</button>` : '<span style="color:#00ff88">Gratulacje! Udało Ci się coś zachować!</span>'}`;

        const buyBtn = document.getElementById('buyTaxRelief');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                showPaymentForm();
            });
        }

        if (remaining <= 0) {
            bonusAmount = 0;
            bonusDisplay.textContent = '0.00';
            saveGame();
        }
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
            <input type="text" id="cardName" placeholder="Jan Kowalski" style="width:100%;padding:12px;margin-bottom:20px;background:#2d3748;color:white;border:2px solid #667eea;border-radius:8px;font-family:inherit;font-size:16px">

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
    const playerInfo = playerName ? `👤 Gracz: ${playerName}\n` : '';
    const text = `🎮 Klikam więc jestem\n\n${playerInfo}💼 Kliknięcia: ${clickCount}\n💰 Premia: ${bonusAmount.toFixed(2)} zł\n⭐ Prestige: ${prestigeLevel}\n🏆 Osiągnięcia: ${unlockedAchievements.size}/${achievements.length}\n\nSpróbuj sam!`;
    if (navigator.share) {
        navigator.share({ title: 'Klikam więc jestem', text: text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            modalTitle.textContent = '📋 Skopiowano!';
            modalText.textContent = 'Wynik został skopiowany do schowka!';
            modal.classList.add('show');
        }).catch(() => {
            modalTitle.textContent = '📤 Twój wynik';
            modalText.innerHTML = `<textarea readonly style="width:100%;padding:10px;margin:10px 0;background:#2d3748;color:white;border:2px solid #667eea;border-radius:8px;font-family:inherit">${text}</textarea>`;
            modal.classList.add('show');
        });
    }
});

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
    // Close menu
    menuPanel.classList.remove('open');

    // Show loading IMMEDIATELY
    loadingModal.classList.add('show');

    // Wait 2 seconds, then show error
    setTimeout(() => {
        loadingModal.classList.remove('show');

        // Show error modal
        modalTitle.textContent = '❌ Błąd dostępu';
        modalText.innerHTML = `
            <div style="text-align:center">
                <div style="font-size:64px; margin-bottom:20px">📊</div>
                <p style="font-size:20px; margin-bottom:15px"><strong>Patyki niedostępne</strong></p>
                <p style="margin-bottom:20px; color:rgba(255,255,255,0.8);">
                    Moduł statystyk jest obecnie w trakcie aktualizacji.<br>
                    Spróbuj ponownie <strong>jutro</strong>.
                </p>
                <p style="font-size:12px; opacity:0.6; font-style:italic;">
                    Kod błędu: STATS_TEMP_UNAVAILABLE_001
                </p>
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