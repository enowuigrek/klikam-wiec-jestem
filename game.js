// ===== GAME STATE =====
let clickCount = 0;
let bonusAmount = 0;
let prestigeLevel = 0;
let playerName = '';
let playerEmoji = '👤';
let buttonSpeed = 1;
let currentTimeIndex = 0;
let unlockedAchievements = new Set();
let seenTimes = new Set();
let readMessages = new Set();
let moveButtonInterval = null;
let isMusicMuted = false;
let currentUser = null;
let needsCloudSync = false;

// ===== ANTI-CHEAT SYSTEM (IMPROVED - MORE TOLERANT) =====
let lastClickTime = 0;
let clicksInSecond = 0;
let suspiciousActivity = 0;
let lastSuspiciousTime = 0;
let isCheater = false;
const MAX_CLICKS_PER_SECOND = 25;
const CHEAT_THRESHOLD = 5;
const RESET_SUSPICION_TIME = 3000;

// ===== CLOUD SYNC SETTINGS =====
const CLOUD_SYNC_INTERVAL = 30000;
const RANKING_REFRESH_INTERVAL = 10000;
let cloudSyncTimer = null;
let rankingRefreshTimer = null;

// ===== MESSAGES DATA =====
let messages = []; // Will be loaded from Supabase

// ===== LOAD MESSAGES FROM SUPABASE =====
async function loadMessages() {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        if (error) throw error;

        if (data) {
            messages = data.map(msg => ({
                id: msg.id,
                from: msg.from_character,
                subject: msg.subject,
                preview: msg.preview,
                body: msg.body,
                date: new Date(msg.published_at).toLocaleDateString('pl-PL'),
                read: false,
                isSystemMessage: msg.is_system
            }));

            console.log(`✅ Loaded ${messages.length} messages from Supabase`);
            updateUnreadBadge();
        }

    } catch (error) {
        console.error('❌ Error loading messages:', error);
    }
}

// ===== DOM ELEMENTS =====
const button = document.getElementById('zdkButton');
const countDisplay = document.getElementById('clickCount');
const bonusDisplay = document.getElementById('bonusAmount');
const prestigeDisplay = document.getElementById('prestigeLevel');
const authScreen = document.getElementById('authScreen');
const titleScreen = document.getElementById('titleScreen');
const startButton = document.getElementById('startButton');
const logoutButton = document.getElementById('logoutButton');
const welcomeEmoji = document.getElementById('welcomeEmoji');
const welcomeUsername = document.getElementById('welcomeUsername');
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
const loadingText = document.getElementById('loadingText');
const achievementNotification = document.getElementById('achievementNotification');
const notifAchievementName = document.getElementById('notifAchievementName');
const notifAchievementIcon = document.getElementById('notifAchievementIcon');
const bgMusic = document.getElementById('bgMusic');

// Stats Panel Elements
const statsPanel = document.getElementById('statsPanel');
const closeStats = document.getElementById('closeStats');
const rankingList = document.getElementById('rankingList');
const refreshRanking = document.getElementById('refreshRanking');
const teamClicks = document.getElementById('teamClicks');
const teamTarget = document.getElementById('teamTarget');
const teamPercent = document.getElementById('teamPercent');
const targetFill = document.getElementById('targetFill');

// Auth Elements
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');
const registerUsername = document.getElementById('registerUsername');
const registerPassword = document.getElementById('registerPassword');
const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
const registerButton = document.getElementById('registerButton');
const registerError = document.getElementById('registerError');

// ===== AUTHENTICATION SYSTEM =====

let selectedEmoji = '👤';

// Emoji selector
document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedEmoji = btn.dataset.emoji;
    });
});

// Tab switching
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginError.textContent = '';
    registerError.textContent = '';
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    loginError.textContent = '';
    registerError.textContent = '';
});

// Register
registerButton.addEventListener('click', async () => {
    const username = registerUsername.value.trim();
    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value;

    registerError.textContent = '';

    if (username.length < 3) {
        registerError.textContent = 'Nazwa użytkownika musi mieć min. 3 znaki';
        return;
    }

    if (password.length < 6) {
        registerError.textContent = 'Hasło musi mieć min. 6 znaków';
        return;
    }

    if (password !== passwordConfirm) {
        registerError.textContent = 'Hasła nie są takie same';
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = 'Tworzenie konta...';

    try {
        // Check if username exists
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            registerError.textContent = 'Ta nazwa użytkownika jest już zajęta';
            registerButton.disabled = false;
            registerButton.textContent = 'Zarejestruj się';
            return;
        }

        // Create account using email format (username@zdk.local)
        const email = `${username}@zdk.local`;
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                    avatar_emoji: selectedEmoji
                }
            }
        });

        if (error) throw error;

        // Update profile with emoji
        if (data.user) {
            await supabase
                .from('profiles')
                .update({ avatar_emoji: selectedEmoji })
                .eq('id', data.user.id);
        }

        // Auto login after registration
        await loginUser(username, password);

    } catch (error) {
        console.error('Registration error:', error);
        registerError.textContent = 'Błąd rejestracji: ' + error.message;
        registerButton.disabled = false;
        registerButton.textContent = 'Zarejestruj się';
    }
});

// Login
loginButton.addEventListener('click', async () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    loginError.textContent = '';

    if (!username || !password) {
        loginError.textContent = 'Wypełnij wszystkie pola';
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Logowanie...';

    await loginUser(username, password);
});

async function loginUser(username, password) {
    try {
        const email = `${username}@zdk.local`;
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        currentUser = data.user;

        // Load profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (profile) {
            playerName = profile.username;
            playerEmoji = profile.avatar_emoji || '👤';
            welcomeEmoji.textContent = playerEmoji;
            welcomeUsername.textContent = playerName;
        }

        // Load game progress from cloud
        await loadGameFromCloud();

        // Load messages from Supabase
        await loadMessages();

        // Hide auth screen, show title screen
        authScreen.style.display = 'none';
        titleScreen.style.display = 'flex';

        loginButton.disabled = false;
        loginButton.textContent = 'Zaloguj się';

    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Błąd logowania: Sprawdź nazwę użytkownika i hasło';
        loginButton.disabled = false;
        loginButton.textContent = 'Zaloguj się';
    }
}

// Logout
logoutButton.addEventListener('click', async () => {
    await saveGameToCloud(); // Save before logout
    await supabase.auth.signOut();
    currentUser = null;
    location.reload(); // Reload page to reset state
});

// Check if user is already logged in
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        currentUser = session.user;

        // Load profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (profile) {
            playerName = profile.username;
            playerEmoji = profile.avatar_emoji || '👤';
            welcomeEmoji.textContent = playerEmoji;
            welcomeUsername.textContent = playerName;
        }

        // Load game progress
        await loadGameFromCloud();

        // Load messages
        await loadMessages();

        // Show title screen
        authScreen.style.display = 'none';
        titleScreen.style.display = 'flex';
    }
}

// ===== CLOUD SAVE/LOAD SYSTEM =====

async function saveGameToCloud() {
    if (!currentUser) return;

    try {
        const gameData = {
            user_id: currentUser.id,
            click_count: clickCount,
            bonus_amount: bonusAmount,
            prestige_level: prestigeLevel,
            button_speed: buttonSpeed,
            current_time_index: currentTimeIndex,
            unlocked_achievements: Array.from(unlockedAchievements),
            seen_times: Array.from(seenTimes),
            last_updated: new Date().toISOString()
        };

        const { error } = await supabase
            .from('game_progress')
            .upsert(gameData, { onConflict: 'user_id' });

        if (error) throw error;

        needsCloudSync = false;
        console.log('✅ Game saved to cloud');

    } catch (error) {
        console.error('❌ Cloud save error:', error);
    }
}

async function loadGameFromCloud() {
    if (!currentUser) return;

    try {
        const { data, error } = await supabase
            .from('game_progress')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

        if (data) {
            clickCount = data.click_count || 0;
            bonusAmount = parseFloat(data.bonus_amount) || 0;
            prestigeLevel = data.prestige_level || 0;
            buttonSpeed = data.button_speed || 1;
            currentTimeIndex = data.current_time_index || 0;
            unlockedAchievements = new Set(data.unlocked_achievements || []);
            seenTimes = new Set(data.seen_times || []);

            countDisplay.textContent = clickCount;
            bonusDisplay.textContent = bonusAmount.toFixed(2);
            prestigeDisplay.textContent = prestigeLevel;

            updateTimeOfDay();
            updateAchievementsList();
            updatePrestigeButton();

            console.log('✅ Game loaded from cloud');
        }

    } catch (error) {
        console.error('❌ Cloud load error:', error);
    }
}

// Auto-save to cloud every 30 seconds
function startCloudSync() {
    cloudSyncTimer = setInterval(async () => {
        if (needsCloudSync) {
            await saveGameToCloud();
        }
    }, CLOUD_SYNC_INTERVAL);
}

// Save on page close
window.addEventListener('beforeunload', () => {
    if (needsCloudSync && currentUser) {
        saveGameToCloud();
    }
});

// ===== RANKING SYSTEM =====

async function loadRanking() {
    try {
        rankingList.innerHTML = '<div class="loading-spinner"></div>';

        // Get top 50 players
        const { data: topPlayers, error } = await supabase
            .from('game_progress')
            .select(`
                click_count,
                prestige_level,
                user_id,
                profiles (username, avatar_emoji)
            `)
            .order('click_count', { ascending: false })
            .limit(50);

        if (error) throw error;

        // Render ranking
        rankingList.innerHTML = '';

        if (!topPlayers || topPlayers.length === 0) {
            rankingList.innerHTML = '<div class="no-data">Brak danych rankingowych</div>';
            return;
        }

        topPlayers.forEach((player, index) => {
            const isCurrentUser = player.user_id === currentUser?.id;
            const row = document.createElement('div');
            row.className = 'ranking-row' + (isCurrentUser ? ' current-user' : '');

            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

            row.innerHTML = `
                <div class="rank-col">${medal || (index + 1)}</div>
                <div class="player-col">
                    <span class="player-emoji">${player.profiles?.avatar_emoji || '👤'}</span>
                    <span class="player-name">${player.profiles?.username || 'Gracz'}</span>
                </div>
                <div class="clicks-col">${player.click_count.toLocaleString('pl-PL')}</div>
                <div class="prestige-col">${player.prestige_level || 0}</div>
            `;
            rankingList.appendChild(row);
        });

        console.log('✅ Ranking loaded');

    } catch (error) {
        console.error('❌ Ranking load error:', error);
        rankingList.innerHTML = '<div class="error-message">Błąd ładowania rankingu</div>';
    }
}

// Refresh ranking when panel is open
function startRankingRefresh() {
    if (rankingRefreshTimer) clearInterval(rankingRefreshTimer);

    rankingRefreshTimer = setInterval(() => {
        if (statsPanel.classList.contains('open')) {
            loadRanking();
        }
    }, RANKING_REFRESH_INTERVAL);
}

refreshRanking.addEventListener('click', loadRanking);

statsBtn.addEventListener('click', () => {
    statsPanel.classList.add('open');
    menuPanel.classList.remove('open');
    loadRanking();
});

closeStats.addEventListener('click', () => {
    statsPanel.classList.remove('open');
});

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

// ===== IMPROVED ANTI-CHEAT SYSTEM =====
function detectCheating() {
    const now = Date.now();
    const timeDiff = now - lastClickTime;

    // Reset suspicion after 3 seconds of normal clicking
    if (now - lastSuspiciousTime > RESET_SUSPICION_TIME) {
        suspiciousActivity = 0;
    }

    if (timeDiff > 1000) {
        clicksInSecond = 1;
    } else {
        clicksInSecond++;
    }

    lastClickTime = now;

    if (clicksInSecond > MAX_CLICKS_PER_SECOND) {
        suspiciousActivity++;
        lastSuspiciousTime = now;

        console.warn(`⚠️ Fast clicking detected: ${clicksInSecond} clicks/sec (${suspiciousActivity}/${CHEAT_THRESHOLD})`);

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
                Violations: ${suspiciousActivity}/${CHEAT_THRESHOLD}<br>
                Status: <span style="color:#ff6b6b;">VIOLATION DETECTED</span>
            </p>
            <p style="margin-bottom:15px;">Odśwież stronę i graj fair! 🎮</p>
            <p style="font-size:12px; opacity:0.6; font-style:italic;">System jest teraz bardziej tolerancyjny (25 kliknięć/s), ale nadal nie pozwala na boty.</p>
        </div>
    `;

    modal.classList.add('show');
}


// ===== GAME LOGIC =====
function getPrestigeMultiplier() {
    return 1 + (prestigeLevel * 0.1);
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
            needsCloudSync = true;
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

    const transitionTime = Math.max(2, 5 - (buttonSpeed - 1) * 0.3);
    button.style.transition = `all ${transitionTime}s linear`;
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
}

function startButtonMovement() {
    if (moveButtonInterval) {
        clearInterval(moveButtonInterval);
    }

    const moveInterval = Math.max(2000, 5000 - (buttonSpeed - 1) * 200);

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
        ctx.fillText(`${playerEmoji} ${playerName}`, 300, 190);
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
    if (bgMusic.paused && !isMusicMuted) {
        bgMusic.play().catch(e => console.log('Music play blocked:', e));
    }

    if (detectCheating()) {
        return;
    }

    clickCount++;
    countDisplay.textContent = clickCount;
    playClickSound();
    needsCloudSync = true;

    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);

    button.style.transition = 'all 0.1s ease';
    const margin = 30;
    let newX = Math.random() * (window.innerWidth - button.offsetWidth - margin * 2) + margin;
    let newY = Math.random() * (window.innerHeight - button.offsetHeight - margin * 2) + margin;
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';

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
        needsCloudSync = true;
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

        document.getElementById('confirmPrestige').addEventListener('click', async () => {
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

            needsCloudSync = true;
            await saveGameToCloud();

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

// Paski button
paskiBtn.addEventListener('click', () => {
    menuPanel.classList.remove('open');
    loadingModal.classList.add('show');
    loadingText.textContent = 'Czekaj, trwa przetwarzanie żądania...';

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
    modal.classList.remove('show');
});

modal.addEventListener('click', e => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Start button
startButton.addEventListener('click', () => {
    titleScreen.style.display = 'none';

    startButtonMovement();
    updateTimeOfDay();
    startBackgroundMusic();
    startCloudSync();
    startRankingRefresh();
});

// ===== INITIALIZATION =====
initMusic();
updateTimeOfDay();
updateAchievementsList();
updateUnreadBadge();
checkAuth(); // Check if user is logged in