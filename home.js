// Initialize Supabase
const supabaseUrl = 'https://cmriyjrqkvpdchvbpnne.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcml5anJxa3ZwZGNodmJwbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzcyODYsImV4cCI6MjA2ODQxMzI4Nn0.wWRO5jZuUfrMPV8A3J7j36yweLe4o-uIcSZYaMhY4O8'

let supabaseClient;
let currentUser = null;
let currentProfile = null;
let chatChannel = null;
let presenceChannel = null;
let onlineUsers = new Set();
let isUserAdmin = false;
let messageToDelete = null;
// ✅ ADD THIS LINE - Declare typingTimer globally
let typingTimer;

// ✅ Also ensure usersTyping is declared
const usersTyping = {};
// Initialize Supabase
function initializeSupabase() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
    return true;
  }
  return false;
}

// Initialize app
if (!initializeSupabase()) {
  const checkInterval = setInterval(() => {
    if (initializeSupabase()) {
      clearInterval(checkInterval);
      initializeApp();
    }
  }, 100);
} else {
  initializeApp();
}

async function initializeApp() {
try {
console.log('🚀 Starting app initialization...');

// Get current user FIRST
const { data: { user }, error } = await supabaseClient.auth.getUser();
if (error || !user) {
  console.error('❌ User authentication failed');
  window.location.href = 'index.html';
  return;
}

currentUser = user;
console.log('✅ User authenticated:', currentUser.id);

// Get user profile SECOND
const { data: profile, error: profileError } = await supabaseClient
  .from('users')
  .select('username, role, email, dob, avatar_url')
  .eq('id', user.id)
  .single();

if (profileError) {
  console.error('Profile fetch error:', profileError);
  currentProfile = {
    username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
    role: 'user',
    email: user.email
  };
} else {
  currentProfile = profile;
}

console.log('✅ Profile loaded:', currentProfile.username);

// Update UI THIRD
updateUserInfo();
initializeProfilePopover();

// Setup realtime FOURTH (after user data is ready)
console.log('🔧 Setting up realtime connections...');
setupRealtimeChat();
setupPresenceTracking();


// Setup event listeners FIFTH
setupEventListeners();

// Load data SIXTH
await Promise.all([
  loadMessages(),
  loadFiles(),
  loadOnlineMembers(),
  loadPinnedMessages()
]);

updateGamesCount();
showWelcomeToast();


} catch (error) {
console.error('Error initializing app:', error);
showToast('error', 'Initialization Error', 'Failed to load the application');
}
}

// ===== PIN MESSAGES FUNCTIONALITY =====

// Check if user can pin messages
function canPinMessages() {
const userRole = currentProfile?.role || 'user';
return userRole === 'admin' || userRole === 'moderator';
}

// Pin/Unpin message
async function togglePinMessage(messageId, isPinned = false) {
if (!canPinMessages()) {
showToast('error', 'Permission Denied', 'Only moderators and admins can pin messages');
return;
}

// Add loading state
const pinBtn = document.querySelector(`[onclick*="togglePinMessage('${messageId}'"]`);
if (pinBtn) {
pinBtn.disabled = true;
pinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
}

try {
const updateData = {
  pinned: !isPinned,
  pinned_at: !isPinned ? new Date().toISOString() : null,
  pinned_by_username: !isPinned ? currentProfile?.username : null
};

const { error } = await supabaseClient
  .from('messages')
  .update(updateData)
  .eq('id', messageId);

if (error) throw error;

const action = !isPinned ? 'pinned' : 'unpinned';
showToast('success', 'Message ' + action, `Message ${action} successfully!`);

// Don't manually reload - let the realtime listener handle it

} catch (error) {
console.error('Error toggling pin:', error);
showToast('error', 'Pin Failed', 'Could not update message pin status');

// Restore button state on error
if (pinBtn) {
  pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';
  pinBtn.disabled = false;
}
}
}


// Load pinned messages
async function loadPinnedMessages() {
try {
const { data: pinnedMessages, error } = await supabaseClient
  .from('messages')
  .select('*')
  .eq('pinned', true)
  .order('pinned_at', { ascending: false })
  .limit(5);

if (error) throw error;

const pinnedSection = document.getElementById('pinnedMessagesSection');
const pinnedContainer = document.getElementById('pinnedMessages');

if (!pinnedMessages || pinnedMessages.length === 0) {
  pinnedSection.style.display = 'none';
  return;
}

// Show pinned section
pinnedSection.style.display = 'block';
pinnedContainer.innerHTML = '';

// Get user profiles for pinned messages
const userIds = [...new Set(pinnedMessages.map(msg => msg.user_id))];
let userProfiles = {};

if (userIds.length > 0) {
  const { data: profiles } = await supabaseClient
    .from('users')
    .select('id, username, email, role, avatar_url')
    .in('id', userIds);

  if (profiles) {
    profiles.forEach(profile => {
      userProfiles[profile.id] = profile;
    });
  }
}

// Render pinned messages
// Render pinned messages - SIMPLIFIED VERSION
pinnedMessages.forEach(msg => {
const profile = userProfiles[msg.user_id];
const senderName = profile?.username || profile?.email?.split('@')[0] || 'Unknown';
const senderRole = profile?.role || 'user';
const avatarUrl = profile?.avatar_url || 'Assets/pfp2.jpg';

const pinnedElement = document.createElement('div');
pinnedElement.className = 'pinned-message';
pinnedElement.innerHTML = `
<div class="pinned-user-info">
  <img src="${avatarUrl}" alt="${senderName}">
  <span class="pinned-username">${senderName}</span>
  <span class="user-role role-${senderRole} pinned-role">
    ${getRoleEmoji(senderRole)}
  </span>
</div>
<div class="pinned-content" title="${msg.content}">
  ${formatMessage(msg.content)}
</div>
${canPinMessages() ? `
  <div class="pinned-actions">
    <button class="unpin-btn" onclick="togglePinMessage('${msg.id}', true)" title="Unpin message">
      <i class="fas fa-times"></i>
    </button>
  </div>
` : ''}
`;

pinnedContainer.appendChild(pinnedElement);
});


} catch (error) {
console.error('Error loading pinned messages:', error);
}
}

// Toggle pinned messages visibility
function togglePinnedMessages() {
const pinnedMessages = document.getElementById('pinnedMessages');
const toggleBtn = document.getElementById('togglePinnedBtn');

if (pinnedMessages.classList.contains('collapsed')) {
pinnedMessages.classList.remove('collapsed');
toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide';
} else {
pinnedMessages.classList.add('collapsed');
toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show';
}
}


// ===== SIMPLIFIED TEXT ANIMATION =====

/* === Title typed once === */
function typeOnce(el, text, i = 0) {
if (i < text.length) {
el.textContent += text[i];
setTimeout(() => typeOnce(el, text, i + 1), 120);
} else {
// Stop cursor after typing completes
document.getElementById('cursor').style.animation = 'none';
document.getElementById('cursor').style.opacity = '0.8';
startSubtitleLoop(); // Launch the second effect
}
}

/* === Looping subtitle === */
const phrases = [
'WELCOME TO THE CORE 🧠',
'MADE FOR FRIENDS', 
'JUST VIBE ✨',
'NO PRESSURE ZONE',
'Strive for progress, not perfection.',
'Every day is a second chance.',
'Your vibe attracts your tribe.',
'Make it happen. Shock everyone.',
'Stay hungry, stay foolish.',
'Today is another opportunity to grow.',
'Focus on the step in front of you, not the whole staircase.',
'Small steps lead to big results.',
'Turn setbacks into comebacks.',
'Your only limit is you.',
'Do it with passion or not at all.',
'Nothing changes if nothing changes.',
'Progress over perfection.',
'Consistency is what transforms average into excellence.',
'Become the hardest working person you know.',
'Doubt kills more dreams than failure ever will.',
'Discipline is choosing between what you want now and what you want most.',
'Stars can’t shine without darkness.',
'Great things take time—keep going.',
'Be stronger than your strongest excuse.',
'Make yourself proud.',
'Success smells like sweat.',
'Create the life you can\'t wait to wake up to.',
'Run the day or the day runs you.',
'Success is a series of small wins.',
'Work in silence, let success make the noise.',
'Fear is temporary. Regret is forever.',
'Be the energy you want to attract.',
'Done is better than perfect.',
'Rise up and attack the day with enthusiasm.',
'Don\'t be busy, be productive.',
'Stay patient and trust your journey.',
'You are your only competition.',
'Dreams don\'t work unless you do.',
'Be the change you wish to see.',
'The comeback is always stronger than the setback.',
'Start where you are, use what you have, do what you can.',
'Keep your eyes on the stars and your feet on the ground.',
'Grow through what you go through.',
'One day or day one—you decide.'

];
let p = 0, pos = 0, del = false;

function startSubtitleLoop() { 
requestAnimationFrame(loop); 
}

function loop() {
const sub = document.getElementById('subtitleText');
if (!sub) return; // Safety check

const full = phrases[p];
sub.textContent = del ? full.slice(0, pos--) : full.slice(0, pos++);

// Switch from typing → pause → deleting
if (!del && pos === full.length + 1) {         // Finished typing
setTimeout(() => { del = true; loop(); }, 3800);
return;
}
if (del && pos === 0) {                        // Finished deleting
del = false;
p = (p + 1) % phrases.length;
}

setTimeout(loop, del ? 70 : 130);
}

/* === Start animation when DOM is ready === */
document.addEventListener('DOMContentLoaded', () => {
console.log('🚀 Page loaded, setting up simplified text animation...');

setTimeout(() => {
typeOnce(document.getElementById('animatedText'), 'CHILL SPACE');
}, 2000);
});

// Add this function to clear test data
function clearTestTypingData() {
console.log('🧹 Clearing test typing data...');

// Remove any test users from the typing object
Object.keys(usersTyping).forEach(userId => {
if (userId.includes('test') || usersTyping[userId].name === 'Test User') {
  console.log(`🗑️ Removing test user: ${userId}`);
  delete usersTyping[userId];
}
});

// Update the indicator to reflect changes
updateTypingIndicator();
console.log('✅ Test data cleared');
}

// Call this once in your browser console or add it temporarily to initializeApp()
clearTestTypingData();



function updateUserInfo() {
const userAvatar = document.getElementById('userAvatar');
const userAvatarImg = document.getElementById('userAvatarImg');
const username = document.getElementById('username');

const displayName = getUserDisplayName(currentUser, currentProfile);
username.textContent = displayName;

// Set avatar image, fallback to default
let avatarUrl = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
if (userAvatarImg) {
userAvatarImg.src = avatarUrl;
userAvatarImg.alt = displayName + " avatar";
}
}


// FIX: Separate profile popover initialization
function initializeProfilePopover() {
  const pop = document.getElementById('profilePopover');
  const userAvatar = document.getElementById('userAvatar');
  
  if (!pop || !userAvatar) {
    console.error('Profile popover elements not found');
    return;
  }

  function fillProfile() {
    if (!pop) return;
    
    const displayName = getUserDisplayName(currentUser, currentProfile);
    document.getElementById('popName').textContent = displayName;
    document.getElementById('popEmail').textContent = currentUser.email || '';
    document.getElementById('popDob').textContent = currentProfile?.dob ? `DOB: ${currentProfile.dob}` : '';
    
    const avatarUrl = currentProfile?.avatar_url || '';
    document.getElementById('popImg').src = avatarUrl || 'Assets/pfp2.jpg';
  }

  function toggleProfile() {
    if (!pop) return;
    
    if (pop.classList.contains('open')) {
      pop.classList.remove('open');
    } else {
      fillProfile();
      const rect = userAvatar.getBoundingClientRect();
      pop.style.right = `${window.innerWidth - rect.right}px`;
      pop.style.top = `${rect.bottom + 8}px`;
      pop.classList.add('open');
    }
  }


  // Click outside to close
  document.addEventListener('click', (e) => {
    if (pop && !pop.contains(e.target) && e.target.id !== 'userAvatar') {
      pop.classList.remove('open');
    }
  });
}

function showWelcomeToast() {
  const displayName = getUserDisplayName(currentUser, currentProfile);
  showToast('success', `Welcome To Chill Space, ${displayName}!`, 'Ready to chill? 🎉', 4000);
}

// FIX: Improved getUserDisplayName function
function getUserDisplayName(user, profile = null) {
  if (profile?.username) {
    return profile.username;
  }
  if (user?.user_metadata?.username) {
    return user.user_metadata.username;
  }
  if (user?.email) {
    return user.email.split('@')[0];
  }
  return 'User';
}

// FIX: Role-based message deletion function
function canDeleteMessage(messageUserId, messageSenderRole) {
  const isCurrentUser = messageUserId === currentUser.id;
  const currentUserRole = currentProfile?.role || 'user';
  
  // Users can only delete their own messages
  if (currentUserRole === 'user') {
    return isCurrentUser;
  }
  
  // Admins can delete any message
  if (currentUserRole === 'admin') {
    return true;
  }
  
  // Moderators can delete any message except admin messages
  if (currentUserRole === 'moderator') {
    return messageSenderRole !== 'admin';
  }
  
  return false;
}

function setupEventListeners() {
console.log('🔧 Setting up event listeners...');

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
logoutBtn.addEventListener('click', logout);
console.log('✅ Logout button listener added');
} else {
console.error('❌ logoutBtn not found');
}

// Code toggle
const codeToggle = document.getElementById('codeToggle');
if (codeToggle) {
codeToggle.addEventListener('click', toggleCodeMode);
console.log('✅ Code toggle listener added');
} else {
console.error('❌ codeToggle not found');
}

// Emoji toggle
const emojiToggle = document.getElementById('emojiToggle');
if (emojiToggle) {
emojiToggle.addEventListener('click', toggleEmojiPicker);
console.log('✅ Emoji toggle listener added');
} else {
console.error('❌ emojiToggle not found');
}

// Fullscreen toggle
const fullscreenToggle = document.getElementById('fullscreenToggle');
if (fullscreenToggle) {
fullscreenToggle.addEventListener('click', openFullscreenEditor);
console.log('✅ Fullscreen toggle listener added');
} else {
console.error('❌ fullscreenToggle not found');
}

// === TYPING INDICATOR SETUP === 
console.log('🔧 Setting up typing indicator listeners...');

const chatInput = document.getElementById('chatInput');
const codeInput = document.getElementById('codeInput');

if (chatInput) {
console.log('✅ Setting up chatInput typing events');

// Input event for typing detection
chatInput.addEventListener('input', handleTyping);

// Blur event to stop typing
chatInput.addEventListener('blur', stopTyping);

// Enter key to send message and stop typing
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    stopTyping(); // Stop typing first
    sendMessage();
  }
});

// Additional keydown for more responsive typing detection
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    stopTyping();
  }
});

console.log('✅ chatInput typing events configured');
} else {
console.error('❌ chatInput element not found!');
}

if (codeInput) {
console.log('✅ Setting up codeInput typing events');

// Input event for typing detection
codeInput.addEventListener('input', handleTyping);

// Blur event to stop typing
codeInput.addEventListener('blur', stopTyping);

// Ctrl+Enter to send code and stop typing
codeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    stopTyping(); // Stop typing first
    sendMessage();
  }
});

// Additional keydown for more responsive typing detection
codeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    stopTyping();
  }
});

console.log('✅ codeInput typing events configured');
} else {
console.error('❌ codeInput element not found!');
}

// User avatar click for profile editing
const userAvatar = document.getElementById('userAvatar');
if (userAvatar) {
userAvatar.onclick = openEditProfile;
console.log('✅ User avatar click listener added');
} else {
console.error('❌ userAvatar not found');
}

// File input change
const fileInput = document.getElementById('fileInput');
if (fileInput) {
fileInput.addEventListener('change', updateFilePreview);
console.log('✅ File input listener added');
} else {
console.error('❌ fileInput not found');
}

// Emoji category buttons
const emojiCategories = document.querySelectorAll('.emoji-category');
if (emojiCategories.length > 0) {
emojiCategories.forEach(button => {
  button.addEventListener('click', (e) => {
    document.querySelectorAll('.emoji-category').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    loadEmojis(e.target.dataset.category);
  });
});
console.log(`✅ ${emojiCategories.length} emoji category listeners added`);
} else {
console.error('❌ No emoji category buttons found');
}

// Emoji search
const emojiSearch = document.getElementById('emojiSearch');
if (emojiSearch) {
emojiSearch.addEventListener('input', (e) => {
  searchEmojis(e.target.value);
});
console.log('✅ Emoji search listener added');
} else {
console.error('❌ emojiSearch not found');
}

// Close emoji picker when clicking outside
document.addEventListener('click', (e) => {
const emojiPicker = document.getElementById('emojiPicker');
const emojiToggleBtn = document.getElementById('emojiToggle');

if (emojiPicker && emojiToggleBtn) {
  if (!emojiPicker.contains(e.target) && !emojiToggleBtn.contains(e.target)) {
    emojiPicker.style.display = 'none';
    emojiToggleBtn.classList.remove('active');
  }
}
});

// Confirm dialog close on click outside
const confirmDialog = document.getElementById('confirmDialog');
if (confirmDialog) {
confirmDialog.addEventListener('click', (e) => {
  if (e.target === confirmDialog) {
    hideConfirmDialog();
  }
});
console.log('✅ Confirm dialog listener added');
} else {
console.error('❌ confirmDialog not found');
}

// Fullscreen editor close on escape
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
  const fullscreenOverlay = document.getElementById('fullscreenOverlay');
  const emojiPickerEl = document.getElementById('emojiPicker');
  
  if (fullscreenOverlay && fullscreenOverlay.style.display === 'flex') {
    closeFullscreenEditor();
  }
  if (emojiPickerEl && emojiPickerEl.style.display === 'block') {
    toggleEmojiPicker();
  }
}
});

console.log('✅ All event listeners setup completed');
}

// === SEPARATE DEBUG FUNCTION === 
function debugTypingSetup() {
console.log('🔍 Debugging typing indicator setup...');

const chatInput = document.getElementById('chatInput');
const codeInput = document.getElementById('codeInput');
const typingIndicator = document.getElementById('typingIndicator');
const typingName = document.getElementById('typingName');
const typingAvatar = document.getElementById('typingAvatar');

console.log('🔍 Element status:');
console.log(`- chatInput: ${chatInput ? '✅ Found' : '❌ Missing'}`);
console.log(`- codeInput: ${codeInput ? '✅ Found' : '❌ Missing'}`);
console.log(`- typingIndicator: ${typingIndicator ? '✅ Found' : '❌ Missing'}`);
console.log(`- typingName: ${typingName ? '✅ Found' : '❌ Missing'}`);
console.log(`- typingAvatar: ${typingAvatar ? '✅ Found' : '❌ Missing'}`);

// Test input detection
if (chatInput) {
chatInput.addEventListener('input', () => {
  console.log('📝 Chat input detected (debug listener)');
});
}

if (codeInput) {
codeInput.addEventListener('input', () => {
  console.log('💻 Code input detected (debug listener)');
});
}

console.log('🔍 Debug setup completed');
}

// === ENHANCED TYPING FUNCTIONS ===
function handleTyping() {
console.log('⌨️ handleTyping called');

if (!presenceChannel) {
console.warn('⚠️ No presence channel available for typing signal');
return;
}

if (!currentUser || !currentProfile) {
console.warn('⚠️ User data not available for typing signal');
return;
}

// Send typing signal
sendTypingSignal(true);

// Reset the timer
clearTimeout(typingTimer);
typingTimer = setTimeout(() => {
console.log('⏱️ Typing timer expired, sending stop signal');
sendTypingSignal(false);
}, 3000);
}

function stopTyping() {
console.log('🛑 stopTyping called');
clearTimeout(typingTimer);
sendTypingSignal(false);
}

function sendTypingSignal(isTyping) {
console.log(`📡 Sending typing signal: ${isTyping ? 'TYPING' : 'STOPPED'}`);

if (!presenceChannel) {
console.error('❌ Presence channel not available');
return;
}

if (!currentUser || !currentProfile) {
console.error('❌ User data not available');
return;
}

const payload = {
typing: isTyping,
name: currentProfile?.username || 'Someone',
avatar: currentProfile?.avatar_url || 'Assets/pfp2.jpg',
userId: currentUser.id 
};

console.log('📤 Typing payload:', payload);

presenceChannel.send({
type: 'broadcast',
event: 'typing',
payload: payload
}).then(() => {
console.log('✅ Typing signal sent successfully');
}).catch(err => {
console.error('❌ Failed to send typing signal:', err);
});
}

// === ENHANCED TYPING EVENT HANDLER ===
function handleTypingEvent(payload) {
console.log('🎯 handleTypingEvent called with:', payload);

if (!payload || !payload.userId) {
console.error('❌ Invalid typing payload received');
return;
}

// ✅ IGNORE TEST USERS
if (payload.userId.includes('test') || payload.name === 'Test User') {
console.log('🚫 Ignoring test user typing event');
return;
}

// ✅ IGNORE YOUR OWN TYPING (optional)
if (payload.userId === currentUser?.id) {
console.log('🚫 Ignoring own typing event');
return;
}

if (payload.typing) {
console.log(`✍️ User ${payload.name} started typing`);
usersTyping[payload.userId] = { 
  name: payload.name, 
  avatar: payload.avatar 
};
} else {
console.log(`⏹️ User ${payload.name} stopped typing`);
delete usersTyping[payload.userId];
}

console.log('👥 Current typing users:', Object.keys(usersTyping));
updateTypingIndicator();
}




/* === MODAL FUNCTIONS === */
// ===============  openPreview  ==================
function openPreview(file) {
const modal        = document.getElementById('previewModal');
const contentBox   = modal.querySelector('.preview-modal-content'); // ⚑ wrapper
const body         = document.getElementById('previewBody');

/* reset previous state */
body.innerHTML = '';
contentBox.classList.remove('img-fit');

const { filetype, filepath, filename } = file;

/* public URL from Supabase */
const { data, error } = supabaseClient
    .storage.from('files')
    .getPublicUrl(filepath);

if (error || !data?.publicUrl) {
showToast('error', 'Preview failed', 'No URL');
return;
}
const url = data.publicUrl;

/* ---------- IMAGE ---------- */
if (filetype.startsWith('image/')) {
const img   = new Image();
img.src     = url;
img.alt     = filename || 'image preview';
img.onload  = () => contentBox.classList.add('img-fit');   // shrink-wrap
img.onerror = () => showToast('error', 'Preview failed', 'Can’t load image');
body.appendChild(img);
}

/* ---------- PDF ---------- */
else if (filetype === 'application/pdf') {
const frame   = document.createElement('iframe');
frame.src     = `${url}#toolbar=0&navpanes=0`;
frame.loading = 'lazy';
body.appendChild(frame);
}

/* ---------- PLAIN-TEXT ---------- */
else if (filetype.startsWith('text/')) {
fetch(url)
  .then(r => r.text())
  .then(txt => {
    const pre   = document.createElement('pre');
    pre.textContent = txt;
    body.appendChild(pre);
  })
  .catch(() =>
    showToast('error', 'Preview failed', 'Can’t fetch text')
  );
}

/* ---------- UNSUPPORTED ---------- */
else {
body.innerHTML = `
  <p style="color:var(--gray);text-align:center;padding:1em">
    ⛔ Preview not supported.<br>
    <a href="${url}" download>Download ${filename}</a>
  </p>`;
}

/* open modal */
modal.classList.add('open');
document.body.classList.add('modal-open');
}
// =================================================


function closePreview() {
  document.getElementById('previewModal').classList.remove('open');
  document.body.classList.remove('modal-open');
}

async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
      showToast('success', 'Goodbye!', 'See you Soon! ☹️');
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    }
  } catch (err) {
    console.error('Error during logout:', err);
    showToast('error', 'Logout Error', 'Failed to logout');
  }
}

// Game Functions
function openGame(gameType) {
  const gameUrls = {
    'chess': 'games/chess/chess.html',
    'tic-tac-toe': 'games/ttt/index.html',
    'typemaster': 'games/typemaster/index.html',
    'advice': 'games/advice/index.html',
    'whiteboard': 'games/white/index.html',
    'dsasolver': 'games/dsasolver/index.html',
    'quiz': 'games/Quiz/quiz.html',
    'snake': 'games/snake/game.html',
  };
  
  const gameNames = {
    'chess': 'Chess Master',
    'tic-tac-toe': 'Tic Tac Toe',
    'typemaster': 'Type Master',
    'advice': 'Boost Up!',
    'whiteboard': 'Creative Board',
    'dsasolver': 'DSA Solver',
    'quiz': 'Take a QUIZ',
    'snake': 'Snake Reloaded'
  };
  
  let gameModal = document.getElementById('gameModal');
  if (!gameModal) {
    gameModal = document.createElement('div');
    gameModal.id = 'gameModal';
    gameModal.className = 'game-modal';
    gameModal.innerHTML = `
      <div class="game-modal-content">
        <div class="game-modal-header">
          <div class="game-modal-title">
            <i class="fas fa-gamepad"></i>
            <span id="gameModalTitle">Game</span>
          </div>
          <button class="game-modal-close" onclick="closeGame()">
            <i class="fas fa-times"></i>
            Close Game
          </button>
        </div>
        <iframe id="gameIframe" class="game-iframe" src=""></iframe>
      </div>
    `;
    document.body.appendChild(gameModal);
  }
  
  document.getElementById('gameModalTitle').textContent = gameNames[gameType] || 'Game';
  var iframe = document.getElementById('gameIframe');
  iframe.src = gameUrls[gameType] || 'games/default.html';
  
  if (gameType === 'chess') {
    iframe.setAttribute('scrolling', 'no');
    iframe.style.overflow = 'hidden';
    iframe.style.background = 'var(--darker)';
  } else {
    iframe.removeAttribute('scrolling');
    iframe.style.overflow = '';
    iframe.style.background = '';
  }
  
  gameModal.style.display = 'flex';
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', handleGameEscape);
  
  showToast('success', 'Game Loading', `Loading ${gameNames[gameType]}...`);
}

function closeGame() {
  const gameModal = document.getElementById('gameModal');
  if (gameModal) {
    gameModal.style.display = 'none';
    document.getElementById('gameIframe').src = '';
  }
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleGameEscape);
}

function handleGameEscape(e) {
  if (e.key === 'Escape') {
    closeGame();
  }
}

function setupPresenceTracking() {
console.log('🔧 Setting up presence tracking...');

presenceChannel = supabaseClient.channel('online-users', {
config: {
  presence: {
    key: currentUser.id,
  },
  broadcast: {
    self: true, // ✅ CHANGE: Allow self-broadcasts for debugging
    ack: false  // ✅ CHANGE: Don't wait for acknowledgments
  }
},
});

presenceChannel
.on('presence', { event: 'sync' }, () => {
  const newState = presenceChannel.presenceState();
  onlineUsers.clear();
  Object.keys(newState).forEach(userId => {
    onlineUsers.add(userId);
  });
  updateOnlineMembers();
})
.on('presence', { event: 'join' }, ({ key, newPresences }) => {
  onlineUsers.add(key);
  updateOnlineMembers();
})
.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
  onlineUsers.delete(key);
  updateOnlineMembers();
})
// ✅ FIXED: Enhanced broadcast listener
.on('broadcast', { event: 'typing' }, (payload) => {
  console.log('📨 Received typing broadcast:', payload);
  console.log('📨 Payload details:', JSON.stringify(payload, null, 2));
  
  // Check if it's your own message (for debugging)
  if (payload.payload?.userId === currentUser?.id) {
    console.log('🔍 This is my own typing signal');
    // For now, DON'T ignore it - let's see if broadcasts work at all
    return; // Comment this out temporarily
  }
  
  if (payload.payload) {
    handleTypingEvent(payload.payload);
  } else {
    console.error('❌ Invalid broadcast payload structure');
  }
})
.subscribe(async (status) => {
  console.log('📡 Presence channel status:', status);
  if (status === 'SUBSCRIBED') {
    console.log('✅ Presence channel subscribed successfully');
    await presenceChannel.track({
      user_id: currentUser.id,
      username: getUserDisplayName(currentUser, currentProfile),
      role: currentProfile?.role || 'user',
      online_at: new Date().toISOString(),
    });
    
  }
});
}



// Chat functionality
async function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const codeInput = document.getElementById('codeInput');
  const codeToggle = document.getElementById('codeToggle');
  
  let messageText;
  if (codeToggle.classList.contains('active')) {
    messageText = codeInput.value.trim();
    if (messageText) {
      const languageSelect = document.getElementById('languageSelect');
      const language = languageSelect ? languageSelect.value : 'javascript';
      messageText = `\`\`\`${language}\n${messageText}\n\`\`\``;
    }
  } else {
    messageText = chatInput.value.trim();
  }

  if (!messageText) return;

  // Clear input immediately
  if (codeToggle.classList.contains('active')) {
    codeInput.value = '';
  } else {
    chatInput.value = '';
  }

  try {
    const { error } = await supabaseClient
      .from('messages')
      .insert({
        user_id: currentUser.id,
        content: messageText,
        sent_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

  } catch (error) {
    console.error('Error sending message:', error);
    showToast('error', 'Send Failed', 'Could not send message');
    if (codeToggle.classList.contains('active')) {
      codeInput.value = messageText.replace(/``````$/g, '');
    } else {
      chatInput.value = messageText;
    }
  }
}

function showDeleteConfirmation(messageId) {
  messageToDelete = messageId;
  document.getElementById('confirmDialog').style.display = 'flex';
}

function hideConfirmDialog() {
  document.getElementById('confirmDialog').style.display = 'none';
  messageToDelete = null;
}

async function confirmDelete() {
  if (!messageToDelete) return;

  try {
    const { error } = await supabaseClient
      .from('messages')
      .delete()
      .eq('id', messageToDelete);

    if (error) {
      throw error;
    }

    showToast('success', 'Message Deleted', 'Message has been removed');
    
  } catch (error) {
    console.error('Error deleting message:', error);
    showToast('error', 'Delete Failed', 'Could not delete message');
  }

  hideConfirmDialog();
}

function deleteMessage(messageId) {
  showDeleteConfirmation(messageId);
}

// Toggle code mode
function toggleCodeMode() {
  const chatInput = document.getElementById('chatInput');
  const codeInput = document.getElementById('codeInput');
  const codeToggle = document.getElementById('codeToggle');
  const languageSelect = document.getElementById('languageSelect');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  
  if (codeToggle.classList.contains('active')) {
    codeToggle.classList.remove('active');
    codeToggle.innerHTML = '<i class="fas fa-code"></i>';
    chatInput.style.display = 'block';
    codeInput.style.display = 'none';
    languageSelect.style.display = 'none';
    fullscreenToggle.style.display = 'none';
    chatInput.focus();
  } else {
    codeToggle.classList.add('active');
    codeToggle.innerHTML = '<i class="fas fa-comment"></i>';
    chatInput.style.display = 'none';
    codeInput.style.display = 'block';
    languageSelect.style.display = 'block';
    fullscreenToggle.style.display = 'block';
    codeInput.focus();
  }
}

// Fullscreen code editor functions
function openFullscreenEditor() {
  const fullscreenOverlay = document.getElementById('fullscreenOverlay');
  const fullscreenTextarea = document.getElementById('fullscreenTextarea');
  const codeInput = document.getElementById('codeInput');
  const languageSelect = document.getElementById('languageSelect');
  const fullscreenLanguageSelect = document.getElementById('fullscreenLanguageSelect');
  
  fullscreenTextarea.value = codeInput.value;
  fullscreenLanguageSelect.value = languageSelect.value;
  
  fullscreenOverlay.style.display = 'flex';
  fullscreenTextarea.focus();
}

function closeFullscreenEditor() {
  const fullscreenOverlay = document.getElementById('fullscreenOverlay');
  const fullscreenTextarea = document.getElementById('fullscreenTextarea');
  const codeInput = document.getElementById('codeInput');
  const languageSelect = document.getElementById('languageSelect');
  const fullscreenLanguageSelect = document.getElementById('fullscreenLanguageSelect');
  
  codeInput.value = fullscreenTextarea.value;
  languageSelect.value = fullscreenLanguageSelect.value;
  
  fullscreenOverlay.style.display = 'none';
  codeInput.focus();
}

function clearFullscreenEditor() {
  document.getElementById('fullscreenTextarea').value = '';
}

async function sendFullscreenCode() {
  const fullscreenTextarea = document.getElementById('fullscreenTextarea');
  const fullscreenLanguageSelect = document.getElementById('fullscreenLanguageSelect');
  
  const code = fullscreenTextarea.value.trim();
  if (!code) return;

  const language = fullscreenLanguageSelect.value;
  const messageText = `\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const { error } = await supabaseClient
      .from('messages')
      .insert({
        user_id: currentUser.id,
        content: messageText,
        sent_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    fullscreenTextarea.value = '';
    closeFullscreenEditor();

  } catch (error) {
    console.error('Error sending code:', error);
    showToast('error', 'Send Failed', 'Could not send code');
  }
}

// Emoji data and functions
const emojiData = {
  recent: ['😊', '👍', '❤️', '😂', '🎉', '🔥', '💯', '👏', '🙏', '✨'],
  smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋'],
  travel: ['✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏰', '⏱️', '⏲️', '🕰️', '🌍', '🌎', '🌏'],
  objects: ['💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️'],
  flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇫', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿']
};

// Toggle emoji picker
function toggleEmojiPicker() {
  const emojiPicker = document.getElementById('emojiPicker');
  const emojiToggle = document.getElementById('emojiToggle');
  
  if (emojiPicker.style.display === 'none') {
    emojiPicker.style.display = 'block';
    emojiToggle.classList.add('active');
    loadEmojis('recent');
    document.getElementById('emojiSearch').focus();
  } else {
    emojiPicker.style.display = 'none';
    emojiToggle.classList.remove('active');
    document.getElementById('chatInput').focus();
  }
}

function loadEmojis(category) {
  const emojiGrid = document.getElementById('emojiGrid');
  const emojis = emojiData[category] || emojiData.recent;
  
  emojiGrid.innerHTML = '';
  emojis.forEach(emoji => {
    const button = document.createElement('button');
    button.className = 'emoji-item';
    button.textContent = emoji;
    button.onclick = () => insertEmoji(emoji);
    emojiGrid.appendChild(button);
  });
}

function insertEmoji(emoji) {
  const chatInput = document.getElementById('chatInput');
  const codeInput = document.getElementById('codeInput');
  const codeToggle = document.getElementById('codeToggle');
  
  if (codeToggle.classList.contains('active')) {
    const start = codeInput.selectionStart;
    const end = codeInput.selectionEnd;
    const text = codeInput.value;
    codeInput.value = text.substring(0, start) + emoji + text.substring(end);
    codeInput.setSelectionRange(start + emoji.length, start + emoji.length);
    codeInput.focus();
  } else {
    const start = chatInput.selectionStart;
    const end = chatInput.selectionEnd;
    const text = chatInput.value;
    chatInput.value = text.substring(0, start) + emoji + text.substring(end);
    chatInput.setSelectionRange(start + emoji.length, start + emoji.length);
    chatInput.focus();
  }
}

function searchEmojis(query) {
  if (!query) {
    loadEmojis('recent');
    return;
  }

  const emojiGrid = document.getElementById('emojiGrid');
  const allEmojis = Object.values(emojiData).flat();
  const filteredEmojis = allEmojis.slice(0, 64);

  emojiGrid.innerHTML = '';
  filteredEmojis.forEach(emoji => {
    const button = document.createElement('button');
    button.className = 'emoji-item';
    button.textContent = emoji;
    button.onclick = () => insertEmoji(emoji);
    emojiGrid.appendChild(button);
  });
}

function setupRealtimeChat() {
chatChannel = supabaseClient.channel('public:messages')
.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'messages'
}, async (payload) => {
  await handleNewMessage(payload.new);
})
.on('postgres_changes', {
  event: 'DELETE',
  schema: 'public',
  table: 'messages'
}, (payload) => {
  handleDeletedMessage(payload.old.id);
})
// ✅ FIXED: Listen to ALL message updates for pin changes
.on('postgres_changes', {
  event: 'UPDATE',
  schema: 'public',
  table: 'messages'
}, (payload) => {
  // Refresh pinned messages whenever any message is updated
  loadPinnedMessages();
  
  // Also refresh the specific message in chat if it's visible
  const messageElement = document.querySelector(`[data-message-id="${payload.new.id}"]`);
  if (messageElement) {
    // Update the pin button state
    const pinBtn = messageElement.querySelector('.pin-btn');
    if (pinBtn) {
      if (payload.new.pinned) {
        pinBtn.classList.add('pinned');
        pinBtn.title = 'Unpin message';
      } else {
        pinBtn.classList.remove('pinned');
        pinBtn.title = 'Pin message';
      }
    }
  }
})
.subscribe();
}


async function handleNewMessage(message) {
const messagesContainer = document.getElementById('chatMessages');
const isCurrentUser = message.user_id === currentUser.id;

let senderName = 'Unknown';
let senderRole = 'user';
let avatarUrl = 'Assets/pfp2.jpg';

if (isCurrentUser) {
senderName = getUserDisplayName(currentUser, currentProfile);
senderRole = currentProfile?.role || 'user';
avatarUrl = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
} else {
try {
  const { data: profile } = await supabaseClient
    .from('users')
    .select('username, email, role, avatar_url')
    .eq('id', message.user_id)
    .single();
  if (profile) {
    senderName = profile.username || profile.email.split('@')[0];
    senderRole = profile.role || 'user';
    avatarUrl = profile.avatar_url || 'Assets/pfp2.jpg';
  }
} catch (err) {
  console.log('Could not fetch sender info:', err);
}
}

const messageElement = document.createElement('div');
messageElement.className = isCurrentUser ? 'message message-sent fade-in' : 'message message-received fade-in';
messageElement.setAttribute('data-message-id', message.id);

const roleClass = `role-${senderRole}`;
const roleDisplay = getRoleEmoji(senderRole);

messageElement.innerHTML = `
<div class="message-sender">
<img src="${avatarUrl}" alt="${senderName}" class="chat-avatar">
${senderName}
<span class="user-role ${roleClass}">${roleDisplay} ${senderRole}</span>
</div>
<div class="message-content">
${formatMessage(message.content)}
<div class="message-actions">
  ${canPinMessages() ? `
    <button class="pin-btn ${message.pinned ? 'pinned' : ''}" onclick="togglePinMessage('${message.id}', ${message.pinned})" title="${message.pinned ? 'Unpin' : 'Pin'} message">
      <i class="fas fa-thumbtack"></i>
    </button>
  ` : ''}
  ${canDeleteMessage(message.user_id, senderRole) ? `
    <button class="message-delete" onclick="deleteMessage('${message.id}')" title="Delete message">
      <i class="fas fa-times"></i>
    </button>
  ` : ''}
</div>
</div>
<div class="message-time">${formatTime(new Date(message.sent_at))}</div>
`;

// Add hover event listeners
messageElement.addEventListener('mouseenter', () => {
const actions = messageElement.querySelector('.message-actions');
if (actions) actions.style.opacity = '1';
});

messageElement.addEventListener('mouseleave', () => {
const actions = messageElement.querySelector('.message-actions');
if (actions) actions.style.opacity = '0';
});


messagesContainer.appendChild(messageElement);
messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


function handleDeletedMessage(messageId) {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  if (messageElement) {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(20px)';
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }
}

function getRoleEmoji(role) {
  const roleEmojis = {
    admin: '👑',
    moderator: '🛡️',
    vip: '⭐',
    user: '👤'
  };
  return roleEmojis[role] || '👤';
}

// Load initial messages
async function loadMessages() {
try {
const { data: messages, error } = await supabaseClient
  .from('messages')
  .select('*')
  .order('sent_at', { ascending: true })
  .limit(50);

const messagesContainer = document.getElementById('chatMessages');

// ✅ FIX: Don't clear innerHTML - this was deleting the typing indicator!
// Instead, remove only message elements
const messageElements = messagesContainer.querySelectorAll('[data-message-id]');
messageElements.forEach(el => el.remove());

if (error) {
  console.error('Error loading messages:', error);
  return;
}

if (!messages || messages.length === 0) {
  messagesContainer.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 2rem;">No messages yet. Be the first to say hello! 👋</p>';
  return;
}

// Rest of your loadMessages code stays the same...
const userIds = [...new Set(messages.map(msg => msg.user_id))];

let userProfiles = {};
if (userIds.length > 0) {
  const { data: profiles } = await supabaseClient
    .from('users')
    .select('id, username, email, role, avatar_url')
    .in('id', userIds);

  if (profiles) {
    profiles.forEach(profile => {
      userProfiles[profile.id] = profile;
    });
  }
}

messages.forEach(msg => {
  const isCurrentUser = msg.user_id === currentUser.id;
  const messageElement = document.createElement('div');
  messageElement.className = isCurrentUser ? 'message message-sent fade-in' : 'message message-received fade-in';
  messageElement.setAttribute('data-message-id', msg.id);

  let senderName = 'Unknown', senderRole = 'user', avatarUrl = 'Assets/pfp2.jpg';
  if (isCurrentUser) {
    senderName = getUserDisplayName(currentUser, currentProfile);
    senderRole = currentProfile?.role || 'user';
    avatarUrl = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
  } else if (userProfiles[msg.user_id]) {
    const profile = userProfiles[msg.user_id];
    senderName = profile.username || profile.email.split('@')[0];
    senderRole = profile.role || 'user';
    avatarUrl = profile.avatar_url || 'Assets/pfp2.jpg';
  }

  const roleClass = `role-${senderRole}`;
  const roleDisplay = getRoleEmoji(senderRole);

  messageElement.innerHTML = `
<div class="message-sender">
<img src="${avatarUrl}" alt="${senderName}" class="chat-avatar">
${senderName}
<span class="user-role ${roleClass}">${roleDisplay} ${senderRole}</span>
</div>
<div class="message-content">
${formatMessage(msg.content)}
<div class="message-actions">
  ${canPinMessages() ? `
    <button class="pin-btn ${msg.pinned ? 'pinned' : ''}" onclick="togglePinMessage('${msg.id}', ${msg.pinned})" title="${msg.pinned ? 'Unpin' : 'Pin'} message">
      <i class="fas fa-thumbtack"></i>
    </button>
  ` : ''}
  ${canDeleteMessage(msg.user_id, senderRole) ? `
    <button class="message-delete" onclick="deleteMessage('${msg.id}')" title="Delete message">
      <i class="fas fa-times"></i>
    </button>
  ` : ''}
</div>
</div>
<div class="message-time">${formatTime(new Date(msg.sent_at))}</div>
`;

// Add hover event listeners
messageElement.addEventListener('mouseenter', () => {
const actions = messageElement.querySelector('.message-actions');
if (actions) actions.style.opacity = '1';
});

messageElement.addEventListener('mouseleave', () => {
const actions = messageElement.querySelector('.message-actions');
if (actions) actions.style.opacity = '0';
});


  messagesContainer.appendChild(messageElement);
});

messagesContainer.scrollTop = messagesContainer.scrollHeight;
} catch (err) {
console.error('Error in loadMessages:', err);
}
}



// File upload functionality
function updateFilePreview() {
  const fileInput = document.getElementById('fileInput');
  const filePreview = document.getElementById('filePreview');
  const files = fileInput.files;
  
  if (files.length === 0) {
    filePreview.innerHTML = '<h4><i class="fas fa-eye"></i> Selected Files</h4><div class="no-files">No files selected</div>';
    return;
  }

  let previewHTML = '<h4><i class="fas fa-eye"></i> Selected Files</h4>';
  
  Array.from(files).forEach((file, index) => {
    const isImage = file.type.startsWith('image/');
    const fileIcon = getFileIcon(file.type);
    
    previewHTML += `
      <div class="preview-item">
        <div class="preview-icon">
          ${isImage ? `<img src="${URL.createObjectURL(file)}" alt="${file.name}" class="preview-image">` : `<i class="fas ${fileIcon}"></i>`}
        </div>
        <div class="preview-info">
          <div class="preview-name">${file.name}</div>
          <div class="preview-size">${formatFileSize(file.size)}</div>
        </div>
        <button class="preview-remove" onclick="removeFileFromPreview(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });
  
  filePreview.innerHTML = previewHTML;
}

function removeFileFromPreview(index) {
  const fileInput = document.getElementById('fileInput');
  const dt = new DataTransfer();
  const files = fileInput.files;
  
  Array.from(files).forEach((file, i) => {
    if (i !== index) {
      dt.items.add(file);
    }
  });
  
  fileInput.files = dt.files;
  updateFilePreview();
}

async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const files = fileInput.files;
  
  if (!files || files.length === 0) {
    showToast('error', 'No Files Selected', 'Please select files to upload.');
    return;
  }

  showToast('info', 'Uploading Files', `Uploading ${files.length} file(s)...`);

  let uploadedCount = 0;
  for (const file of files) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabaseClient
        .from('files')
        .insert({
          user_id: currentUser.id,
          filename: file.name,
          filetype: file.type,
          filepath: fileName,
          filesize: file.size
        });

      if (dbError) throw dbError;
      uploadedCount++;

    } catch (err) {
      console.error('Error uploading file:', err);
    }
  }

  if (uploadedCount > 0) {
    showToast('success', 'Upload Complete!', `Successfully uploaded ${uploadedCount} file(s)!`);
    fileInput.value = '';
    updateFilePreview();
    loadFiles();
  } else {
    showToast('error', 'Upload Failed', 'No files were uploaded successfully.');
  }
}

// Load files
async function loadFiles() {
  try {
    const { data: files, error } = await supabaseClient
      .from('files')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error loading files:', error);
      return;
    }

    const fileContainer = document.getElementById('fileContainer');
    fileContainer.innerHTML = '';

    if (!files || files.length === 0) {
      fileContainer.innerHTML = '<p style="color: var(--gray); text-align: center;">No files shared yet</p>';
      return;
    }

    files.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.onclick = () => openPreview(file); 
      fileItem.className = 'file-item fade-in';
      fileItem.innerHTML = `
        <div class="file-info">
          <i class="fas ${getFileIcon(file.filetype)} file-icon"></i>
          <div class="file-details">
            <div class="file-name" title="${file.filename}">${file.filename}</div>
            <div class="file-meta">${formatFileSize(file.filesize)}</div>
          </div>
        </div>
        <div class="file-actions">
          <button class="btn btn-outline btn-sm" onclick="downloadFile('${file.filepath}', '${file.filename}')">
            <i class="fas fa-download"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteFile('${file.id}', '${file.filepath}', '${file.filename}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      fileContainer.appendChild(fileItem);
    });
  } catch (err) {
    console.error('Error in loadFiles:', err);
  }
}

async function downloadFile(filepath, filename) {
  try {
    const { data, error } = await supabaseClient.storage
      .from('files')
      .download(filepath);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('success', 'Download Started', `${filename} download began!`);
  } catch (err) {
    console.error('Error downloading file:', err);
    showToast('error', 'Download Failed', 'Could not download file.');
  }
}

async function deleteFile(fileId, filepath, filename) {
  if (!confirm(`Delete "${filename}"?`)) return;

  try {
    await supabaseClient.storage
      .from('files')
      .remove([filepath]);

    await supabaseClient
      .from('files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', currentUser.id);

    showToast('success', 'File Deleted', `"${filename}" deleted successfully!`);
    loadFiles();
  } catch (err) {
    console.error('Error deleting file:', err);
    showToast('error', 'Delete Failed', 'Could not delete file.');
  }
}

// Load online members
async function loadOnlineMembers() {
  try {
    const { data: allMembers, error } = await supabaseClient
      .from('users')
      .select('id, username, email, role ,  avatar_url')
      .order('username', { ascending: true });

    if (error) {
      console.error('Error loading members:', error);
      return;
    }

    updateOnlineMembers(allMembers);
    
  } catch (err) {
    console.error('Error in loadOnlineMembers:', err);
  }
}

function updateOnlineMembers(allMembers = null) {
const membersList = document.getElementById('membersList');
const onlineCount = document.getElementById('onlineCount');

if (!allMembers) {
loadOnlineMembers();
return;
}

const onlineMembers = allMembers.filter(member => onlineUsers.has(member.id));

membersList.innerHTML = '';

if (onlineMembers.length === 0) {
membersList.innerHTML = '<p style="color: var(--gray); text-align: center;">No members online</p>';
onlineCount.textContent = '0 Online';
return;
}

onlineMembers.forEach(member => {
const memberElement = document.createElement('div');
memberElement.className = 'member';

const displayName = member.username || member.email.split('@')[0];
const avatarUrl = member.avatar_url || 'Assets/pfp2.jpg';  // ← Show actual profile pic
const roleEmoji = getRoleEmoji(member.role || 'user');

memberElement.innerHTML = `
  <div class="member-avatar">
    <img src="${avatarUrl}" alt="${displayName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
    <div class="member-status online"></div>
  </div>
  <div class="member-info">
    <div class="member-name">
      ${displayName}
      <span class="user-role role-${member.role || 'user'}">${roleEmoji} ${member.role || 'user'}</span>
    </div>
    <div class="member-role">Online now</div>
  </div>
`;

membersList.appendChild(memberElement);
});

onlineCount.textContent = `${onlineMembers.length} Online`;
}


// ===== ENHANCED MESSAGE FORMATTING =====
function formatMessage(content) {
// First handle code blocks (before link formatting to avoid conflicts)
if (content.includes('```')) {
content = content.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, language, code) => {
return `
  <div class="code-block">
    <div class="code-header">
      <span class="code-language">${language || 'code'}</span>
      <button class="code-copy" onclick="copyCode(this)" title="Copy code">
        <i class="fas fa-copy"></i>
      </button>
    </div>
    <pre class="code-content"><code>${escapeHtml(code.trim())}</code></pre>
  </div>
`;
});
}

// Then handle URLs (but not inside code blocks)
const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[^\s<>"']*[^\s<>"'.,;!?)])/gi;

content = content.replace(urlRegex, (url) => {
// Don't format URLs that are already inside HTML tags (like code blocks)
if (content.indexOf(`<code>${url}</code>`) !== -1 || content.indexOf(`>${url}<`) !== -1) {
  return url;
}

let displayUrl = url;
let fullUrl = url;

// Add https:// if it starts with www.
if (url.toLowerCase().startsWith('www.')) {
  fullUrl = 'https://' + url;
}

// Truncate very long URLs for display
if (displayUrl.length > 50) {
  displayUrl = displayUrl.substring(0, 47) + '...';
}

return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: underline; word-break: break-all;">${displayUrl}</a>`;
});

return content;


// ===== MISSING HELPER FUNCTIONS =====

// Escape HTML to prevent XSS in code blocks
function escapeHtml(text) {
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
}

// Copy code functionality
function copyCode(button) {
const codeBlock = button.closest('.code-block');
const codeContent = codeBlock.querySelector('.code-content code');
const text = codeContent.textContent;

// Use modern clipboard API
if (navigator.clipboard && window.isSecureContext) {
navigator.clipboard.writeText(text).then(() => {
  showCopyFeedback(button);
}).catch(err => {
  console.error('Failed to copy code:', err);
  fallbackCopyTextToClipboard(text, button);
});
} else {
// Fallback for older browsers
fallbackCopyTextToClipboard(text, button);
}
}

// Fallback copy method
function fallbackCopyTextToClipboard(text, button) {
const textArea = document.createElement("textarea");
textArea.value = text;

// Avoid scrolling to bottom
textArea.style.top = "0";
textArea.style.left = "0";
textArea.style.position = "fixed";
textArea.style.opacity = "0";

document.body.appendChild(textArea);
textArea.focus();
textArea.select();

try {
const successful = document.execCommand('copy');
if (successful) {
  showCopyFeedback(button);
} else {
  showToast('error', 'Copy Failed', 'Could not copy code to clipboard');
}
} catch (err) {
console.error('Fallback copy failed:', err);
showToast('error', 'Copy Failed', 'Could not copy code to clipboard');
}

document.body.removeChild(textArea);
}

// Visual feedback for copy action
function showCopyFeedback(button) {
const originalContent = button.innerHTML;
button.innerHTML = '<i class="fas fa-check"></i>';
button.style.color = 'var(--success)';

setTimeout(() => {
button.innerHTML = originalContent;
button.style.color = '';
}, 2000);

showToast('success', 'Copied!', 'Code copied to clipboard');
}

}


function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(filetype) {
  const typeMap = {
    'pdf': 'fa-file-pdf',
    'doc': 'fa-file-word',
    'docx': 'fa-file-word',
    'ppt': 'fa-file-powerpoint',
    'pptx': 'fa-file-powerpoint',
    'jpg': 'fa-file-image',
    'jpeg': 'fa-file-image',
    'png': 'fa-file-image',
    'gif': 'fa-file-image',
    'mp4': 'fa-file-video',
    'mp3': 'fa-file-audio',
    'zip': 'fa-file-archive'
  };

  if (!filetype) return 'fa-file';
  const ext = filetype.split('/').pop();
  return typeMap[ext] || 'fa-file';
}

function safeCopy(text, target, btn) {
  if (!text) {
    showToast('error', 'Copy Failed', 'Nothing to copy!');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.color = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.color = 'var(--gray)';
      }, 2000);
    }
    showToast('success', 'Code Copied', 'Code copied to clipboard!');
  }).catch(() => {
    showToast('error', 'Copy Failed', 'Could not copy code to clipboard');
  });
}

function copyCode(copyBtn) {
  const codeBlock = copyBtn.closest('.code-block');
  if (!codeBlock) {
    showToast('error', 'Copy Failed', 'Code block not found!');
    return;
  }
  const codeElement = codeBlock.querySelector('.code-content');
  if (!codeElement) {
    showToast('error', 'Copy Failed', 'No code found to copy!');
    return;
  }
  const text = codeElement.textContent;
  safeCopy(text, codeElement, copyBtn);
}

function copyFromElement(selector) {
  const el = document.querySelector(selector);
  if (!el) {
    alert('Error: Copy target element not found');
    return;
  }
  safeCopy(el.textContent, el);
}

/* ---------- Typing indicator helpers ---------- */


function handleTyping() {
console.log('⌨️ handleTyping called');

if (!presenceChannel) {
console.warn('⚠️ No presence channel available for typing signal');
return;
}

if (!currentUser || !currentProfile) {
console.warn('⚠️ User data not available for typing signal');
return;
}

// Send typing signal
sendTypingSignal(true);

// Reset the timer - now typingTimer is properly declared
clearTimeout(typingTimer);
typingTimer = setTimeout(() => {
console.log('⏱️ Typing timer expired, sending stop signal');
sendTypingSignal(false);
}, 3000);
}

function stopTyping() {
console.log('🛑 stopTyping called');
clearTimeout(typingTimer);
sendTypingSignal(false);
}

function sendTypingSignal(isTyping) {
console.log(`📡 Sending typing signal: ${isTyping ? 'TYPING' : 'STOPPED'}`);

if (!presenceChannel) {
console.error('❌ Presence channel not available');
return;
}

if (!currentUser || !currentProfile) {
console.error('❌ User data not available');
return;
}

const payload = {
typing: isTyping,
name: currentProfile?.username || 'Someone',
avatar: currentProfile?.avatar_url || 'Assets/pfp2.jpg',
userId: currentUser.id 
};

console.log('📤 Payload:', payload);

presenceChannel.send({
type: 'broadcast',
event: 'typing',
payload: payload
}).then(() => {
console.log('✅ Typing signal sent successfully');
}).catch(err => {
console.error('❌ Failed to send typing signal:', err);
});
}

function handleTypingEvent(payload) {
console.log('🎯 handleTypingEvent called with:', payload);

if (!payload || !payload.userId) {
console.error('❌ Invalid typing payload received');
return;
}

// Ignore your own typing signals
if (payload.userId === currentUser?.id) {
console.log('🚫 Ignoring own typing signal');
return;
}

if (payload.typing) {
console.log(`✍️ User ${payload.name} started typing`);
usersTyping[payload.userId] = { 
  name: payload.name, 
  avatar: payload.avatar 
};
} else {
console.log(`⏹️ User ${payload.name} stopped typing`);
delete usersTyping[payload.userId];
}

console.log('👥 Current typing users:', Object.keys(usersTyping));
updateTypingIndicator();
}

function updateTypingIndicator() {
console.log('🔄 updateTypingIndicator called');

const indicator = document.getElementById('typingIndicator');
const nameSpan = document.getElementById('typingName');
const avatarImg = document.getElementById('typingAvatar');
const messagesContainer = document.getElementById('chatMessages');

if (!indicator) {
console.error('❌ typingIndicator element not found!');
return;
}

const typers = Object.values(usersTyping);
console.log(`👥 ${typers.length} users currently typing:`, typers);

if (typers.length === 0) {
console.log('🚫 Hiding typing indicator');
indicator.classList.add('hidden');
return;
}

console.log('✅ Showing typing indicator');

if (typers.length === 1) {
const user = typers[0];
if (nameSpan) nameSpan.textContent = `${user.name} is`;
if (avatarImg) avatarImg.src = user.avatar;
console.log(`👤 Single user typing: ${user.name}`);
} else {
if (nameSpan) nameSpan.textContent = 'Several people are';
if (avatarImg) avatarImg.src = 'Assets/pfp2.jpg';
console.log('👥 Multiple users typing');
}

indicator.classList.remove('hidden');
if (messagesContainer) {
messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
}


// This is a new function that will manage the usersTyping object
function handleTypingEvent(payload) {
console.log('🎯 handleTypingEvent called with:', payload);

if (!payload || !payload.userId) {
console.error('❌ Invalid payload received');
return;
}

if (payload.typing) {
console.log(`✍️ User ${payload.name} started typing`);
usersTyping[payload.userId] = { 
  name: payload.name, 
  avatar: payload.avatar 
};
} else {
console.log(`⏹️ User ${payload.name} stopped typing`);
delete usersTyping[payload.userId];
}

console.log('👥 Current typing users:', Object.keys(usersTyping));
updateTypingIndicator();
}




// Toast notification system
function showToast(type, title, message, duration = 4000) {
  const toastContainer = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = `toast-${Date.now()}`;
  
  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconMap[type]}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="closeToast('${toast.id}')" style="position:absolute;top:8px;right:8px;background:none;border:none;color:inherit;font-size:1.1em;cursor:pointer;">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }
  }, duration);
  
  return toast.id;
}

function closeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (chatChannel) {
    chatChannel.unsubscribe();
  }
  if (presenceChannel) {
    presenceChannel.unsubscribe();
  }
});

// FIX: Games count update function
function updateGamesCount() {
  const gamesGrid = document.querySelector('.games-grid');
  const count = gamesGrid ? gamesGrid.querySelectorAll('.game-card').length : 0;
  const gamesCount = document.getElementById('gamesCount');
  if (gamesCount) {
    gamesCount.textContent = count + ' Games Available';
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateGamesCount);

// Open the edit profile modal
document.getElementById('profileEditForm').onsubmit = async function(e){
e.preventDefault();

const usernameVal = document.getElementById('editUsername').value;
const dobVal = document.getElementById('editDob').value;
const avatarFile = document.getElementById('avatarInput').files[0];

let avatarUrl = currentProfile?.avatar_url || '';

// If avatar changed, upload to Supabase Storage
if (avatarFile) {
if (!currentUser?.id) {
  showToast('error', 'User not authenticated');
  return;
}
if (!avatarFile) {
  showToast('error', 'No file selected');
  return;
}
const fileExt = avatarFile.name.split('.').pop();
const newFileName = `${currentUser.id}/profile_${Date.now()}.${fileExt}`;
console.log('Uploading:', currentUser.id, newFileName, avatarFile);
const { error: upErr } = await supabaseClient.storage
  .from('avatars')
  .upload(newFileName, avatarFile, { upsert: true });

if (upErr) {
  showToast('error', 'Avatar Error', 'Could not upload profile picture!');
  return;
}

// Get public url
const { data } = supabaseClient.storage.from('avatars').getPublicUrl(newFileName);
avatarUrl = data.publicUrl;
}

// Update user profile in your Supabase "users" table
const { error: upError } = await supabaseClient
.from('users')
.update({
  username: usernameVal,
  dob: dobVal,
  avatar_url: avatarUrl
})
.eq('id', currentUser.id);

if (!upError) {
currentProfile.username = usernameVal;
currentProfile.dob = dobVal;
currentProfile.avatar_url = avatarUrl;
updateUserInfo();
closeEditProfile();
showToast('success', 'Profile Updated', 'Your profile was updated successfully!');
} else {
showToast('error', 'Update Failed', 'Profile update failed');
}
};

// Open the edit profile modal
function openEditProfile() {
  document.getElementById('editUsername').value = currentProfile?.username || '';
  // Convert DOB if present and in DD-MM-YYYY format
  let dob = currentProfile?.dob || '';
  if (dob && dob.includes('-')) {
    const parts = dob.split('-').map(s => s.trim());
    if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      dob = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
    }
  }
  document.getElementById('editDob').value = dob;
  document.getElementById('editProfileImg').src = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
  document.getElementById('editProfileModal').classList.add('open');
  document.body.classList.add('modal-open');
}

function closeEditProfile() {
  document.getElementById('editProfileModal').classList.remove('open');
  document.body.classList.remove('modal-open');
}
