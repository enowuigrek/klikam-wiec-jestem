// ===== ADMIN PANEL - BÓG PRĄDU =====

let currentAdmin = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const adminUsername = document.getElementById('adminUsername');
const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminName = document.getElementById('adminName');

// Tabs
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Send Mail Form
const fromCharacter = document.getElementById('fromCharacter');
const subject = document.getElementById('subject');
const preview = document.getElementById('preview');
const bodyContent = document.getElementById('bodyContent');
const isSystem = document.getElementById('isSystem');
const scheduledDate = document.getElementById('scheduledDate');
const sendMailBtn = document.getElementById('sendMailBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const sendStatus = document.getElementById('sendStatus');

// Sent Mails
const sentMailsList = document.getElementById('sentMailsList');
const refreshMailsBtn = document.getElementById('refreshMailsBtn');

// ===== AUTHENTICATION =====

loginBtn.addEventListener('click', async () => {
    const username = adminUsername.value.trim();
    const password = adminPassword.value;

    loginError.textContent = '';

    if (!username || !password) {
        loginError.textContent = 'Wypełnij wszystkie pola';
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Logowanie...';

    try {
        const email = `${username}@zdk.local`;
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('is_admin')
            .eq('user_id', data.user.id)
            .single();

        if (adminError || !adminData || !adminData.is_admin) {
            await supabase.auth.signOut();
            throw new Error('Access Denied - Not an admin');
        }

        // Load profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_emoji')
            .eq('id', data.user.id)
            .single();

        currentAdmin = data.user;
        adminName.textContent = `${profile?.avatar_emoji || '⚡'} ${profile?.username || 'Admin'}`;

        // Show admin panel
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';

        loadSentMails();

    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = error.message === 'Access Denied - Not an admin'
            ? '⚡ ACCESS DENIED - You are not authorized'
            : 'Błąd logowania: Sprawdź dane';
        loginBtn.disabled = false;
        loginBtn.textContent = '⚡ ZALOGUJ';
    }
});

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    currentAdmin = null;
    location.reload();
});

// Check if already logged in
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        // Check if admin
        const { data: adminData } = await supabase
            .from('admin_users')
            .select('is_admin')
            .eq('user_id', session.user.id)
            .single();

        if (adminData && adminData.is_admin) {
            currentAdmin = session.user;

            const { data: profile } = await supabase
                .from('profiles')
                .select('username, avatar_emoji')
                .eq('id', currentAdmin.id)
                .single();

            adminName.textContent = `${profile?.avatar_emoji || '⚡'} ${profile?.username || 'Admin'}`;

            loginScreen.style.display = 'none';
            adminPanel.style.display = 'block';

            loadSentMails();
        }
    }
}

// ===== TABS =====

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`${targetTab}Tab`).classList.add('active');

        if (targetTab === 'sent') {
            loadSentMails();
        }
    });
});

// ===== SCHEDULED DATE TOGGLE =====

document.querySelectorAll('input[name="publishTime"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'scheduled') {
            scheduledDate.style.display = 'block';
            scheduledDate.required = true;
        } else {
            scheduledDate.style.display = 'none';
            scheduledDate.required = false;
        }
    });
});

// ===== EDITOR HELPER =====

window.insertTag = function(tag) {
    const textarea = bodyContent;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let insertText = '';
    if (tag === 'br') {
        insertText = '<br>';
    } else if (selectedText) {
        insertText = `<${tag}>${selectedText}</${tag}>`;
    } else {
        insertText = `<${tag}></${tag}>`;
    }

    textarea.value = textarea.value.substring(0, start) + insertText + textarea.value.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
}

// ===== SEND MAIL =====

sendMailBtn.addEventListener('click', async () => {
    sendStatus.className = 'status';
    sendStatus.textContent = '';

    // Validation
    if (!subject.value.trim()) {
        sendStatus.className = 'status error';
        sendStatus.textContent = '❌ Wpisz temat wiadomości';
        return;
    }

    if (!preview.value.trim()) {
        sendStatus.className = 'status error';
        sendStatus.textContent = '❌ Wpisz preview wiadomości';
        return;
    }

    if (!bodyContent.value.trim()) {
        sendStatus.className = 'status error';
        sendStatus.textContent = '❌ Wpisz treść wiadomości';
        return;
    }

    const publishTime = document.querySelector('input[name="publishTime"]:checked').value;
    if (publishTime === 'scheduled' && !scheduledDate.value) {
        sendStatus.className = 'status error';
        sendStatus.textContent = '❌ Wybierz datę publikacji';
        return;
    }

    sendMailBtn.disabled = true;
    sendMailBtn.textContent = '⚡ WYSYŁANIE...';

    try {
        const publishedAt = publishTime === 'now'
            ? new Date().toISOString()
            : new Date(scheduledDate.value).toISOString();

        const { data, error } = await supabase
            .from('messages')
            .insert([{
                from_character: fromCharacter.value,
                subject: subject.value.trim(),
                preview: preview.value.trim(),
                body: bodyContent.value.trim(),
                published_at: publishedAt,
                is_system: isSystem.checked
            }])
            .select();

        if (error) throw error;

        sendStatus.className = 'status success';
        sendStatus.textContent = '✅ Wiadomość wysłana pomyślnie!';

        // Clear form
        clearForm();

        // Refresh sent mails list
        setTimeout(() => {
            loadSentMails();
        }, 500);

    } catch (error) {
        console.error('Send error:', error);
        sendStatus.className = 'status error';
        sendStatus.textContent = '❌ Błąd wysyłania: ' + error.message;
    }

    sendMailBtn.disabled = false;
    sendMailBtn.textContent = '⚡ WYŚLIJ MAIL';
});

// ===== CLEAR FORM =====

clearFormBtn.addEventListener('click', clearForm);

function clearForm() {
    subject.value = '';
    preview.value = '';
    bodyContent.value = '';
    isSystem.checked = false;
    scheduledDate.value = '';
    document.querySelector('input[name="publishTime"][value="now"]').checked = true;
    scheduledDate.style.display = 'none';
    sendStatus.textContent = '';
}

// ===== LOAD SENT MAILS =====

async function loadSentMails() {
    sentMailsList.innerHTML = '<div class="loading">Ładowanie wiadomości...</div>';

    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            sentMailsList.innerHTML = '<div class="no-mails">Brak wysłanych wiadomości</div>';
            return;
        }

        sentMailsList.innerHTML = '';

        data.forEach(mail => {
            const mailItem = document.createElement('div');
            mailItem.className = 'mail-item' + (mail.is_system ? ' system' : '');

            const publishDate = new Date(mail.published_at);
            const isScheduled = publishDate > new Date();

            mailItem.innerHTML = `
                <div class="mail-header">
                    <div class="mail-info">
                        <h3>${mail.subject}</h3>
                        <div class="mail-meta">Od: ${mail.from_character}</div>
                        <div class="mail-meta">
                            ${isScheduled ? '📅 Zaplanowana na: ' : '📤 Wysłana: '}
                            ${publishDate.toLocaleString('pl-PL')}
                        </div>
                        <div class="mail-meta">
                            ${mail.is_system ? '🚨 Wiadomość systemowa' : '📧 Wiadomość zwykła'}
                        </div>
                    </div>
                    <div class="mail-actions">
                        <button class="btn-danger" onclick="deleteMail('${mail.id}')">🗑️ Usuń</button>
                    </div>
                </div>
                <div class="mail-preview">${mail.preview}</div>
            `;

            sentMailsList.appendChild(mailItem);
        });

    } catch (error) {
        console.error('Load error:', error);
        sentMailsList.innerHTML = '<div class="loading">❌ Błąd ładowania wiadomości</div>';
    }
}

refreshMailsBtn.addEventListener('click', loadSentMails);

// ===== DELETE MAIL =====

window.deleteMail = async function(messageId) {
    if (!confirm('⚡ Czy na pewno chcesz usunąć tę wiadomość?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

        if (error) throw error;

        loadSentMails();

    } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Błąd usuwania: ' + error.message);
    }
}

// ===== INITIALIZATION =====

checkAuth();