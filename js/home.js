let supabaseClient;
let currentUser = null;
let currentProfile = null;
let chatChannel = null;
let presenceChannel = null;
let onlineUsers = new Set();
let isUserAdmin = false;
let messageToDelete = null;
let typingTimer;
let currentChatMode = 'group'; // 'group' or 'private'
let privateChatUser = null; // Selected user object
let allUsers = []; // Cache of all users


const unreadMessages = new Map();
const usersTyping = {};

// Initialize Supabase
function initializeSupabase() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = window.supabaseClient;
    return true;
  }
  return false;
}

/**
 * Load unread counts from database on startup
 */
async function loadUnreadFromDatabase() {
  try {
    console.log('📂 Loading unread counts from database...');

    const { data, error } = await supabaseClient
      .from('unread_messages')
      .select('sender_id, unread_count')
      .eq('user_id', currentUser.id);

    if (error) throw error;

    // Clear existing map
    unreadMessages.clear();

    // Load from database
    if (data && data.length > 0) {
      data.forEach(row => {
        if (row.unread_count > 0) {
          unreadMessages.set(row.sender_id, row.unread_count);
        }
      });
      console.log('✅ Loaded unread counts:', Object.fromEntries(unreadMessages));
    } else {
      console.log('📭 No unread messages');
    }

    // Update UI
    updatePrivateTabBadge();
    if (currentChatMode === 'private') {
      renderUsersList();
    }

  } catch (err) {
    console.error('❌ Error loading unread messages:', err);
  }
}

/**
 * Increment unread count in database
 */
async function incrementUnreadInDatabase(senderId) {
  try {
    console.log('📬 Incrementing unread for sender:', senderId);

    // Use upsert to increment or create
    const { data, error } = await supabaseClient
      .from('unread_messages')
      .upsert({
        user_id: currentUser.id,
        sender_id: senderId,
        unread_count: 1,
        last_message_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,sender_id',
        // Increment existing count
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      // If row exists, increment it
      const { error: updateError } = await supabaseClient.rpc(
        'increment_unread_count',
        {
          p_user_id: currentUser.id,
          p_sender_id: senderId
        }
      );

      if (updateError) throw updateError;
    }

    // Update local map
    const currentCount = unreadMessages.get(senderId) || 0;
    unreadMessages.set(senderId, currentCount + 1);

    console.log('✅ Unread count updated for:', senderId);

    // Update UI
    updatePrivateTabBadge();
    if (currentChatMode === 'private') {
      renderUsersList();
    }

  } catch (err) {
    console.error('❌ Error incrementing unread:', err);
  }
}

/**
 * Clear unread count in database when chat is opened
 */
async function clearUnreadInDatabase(senderId) {
  try {
    console.log('🗑️ Clearing unread for sender:', senderId);

    const { error } = await supabaseClient
      .from('unread_messages')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('sender_id', senderId);

    if (error) throw error;

    // Update local map
    unreadMessages.delete(senderId);

    console.log('✅ Unread count cleared for:', senderId);

    // Update UI
    updatePrivateTabBadge();
    if (currentChatMode === 'private') {
      renderUsersList();
    }

  } catch (err) {
    console.error('❌ Error clearing unread:', err);
  }
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
  const loginSuccess = sessionStorage.getItem('loginSuccess');
  let homeLoadingScreen = null;

  if (loginSuccess === 'true') {
    const loadingHTML = `
      <div id="homeLoadingScreen" class="loading-overlay" style="display: flex;">
        <div class="loading-container">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <div class="loading-text">
            <h3>Welcome back to Chill Space! 😎</h3>
            <p>Setting up your dashboard...</p>
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    homeLoadingScreen = document.getElementById('homeLoadingScreen');
  }

  try {
    console.log('🚀 Starting app initialization...');

    // Get current user FIRST
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) {
      console.error('❌ User authentication failed');
      window.location.href = '../index.html';
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

    // Enhanced OAuth verification check
    console.log('🔐 Checking OAuth verification status...');

    // Get all user identities to check for email/password signup
    const { data: identities, error: identitiesError } = await supabaseClient
      .from('auth.identities')
      .select('provider')
      .eq('user_id', user.id);

    const isGoogleLogin = user.app_metadata.provider === 'google';
    const hasEmailIdentity = identities?.some(id => id.provider === 'email') ||
      user.identities?.some(id => id.provider === 'email');

    // Check if user signed up with email first but hasn't verified
    if (isGoogleLogin && hasEmailIdentity && !user.email_confirmed_at) {
      console.log('❌ Google user with unverified email detected');
      showToast('error', 'Verification Required', '⚠️ Please verify your email first before using Google login!', 5000);

      await supabaseClient.auth.signOut();
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 3000);
      return;
    }

    console.log('✅ OAuth verification check passed');

    // Update UI THIRD
    updateUserInfo();
    initializeProfilePopover();

    // Setup realtime FOURTH
    console.log('🔧 Setting up realtime connections...');
    setupRealtimeChat();
    setupPresenceTracking();

    // Setup event listeners FIFTH
    setupEventListeners();
    setupChatTabs();
    loadUnreadFromStorage();

    // Load data SIXTH
    await Promise.all([
      loadMessages(),
      loadFiles(),
      loadOnlineMembers(),
      loadPinnedMessages(),
      loadUnreadFromDatabase()
    ]);

    updateGamesCount();
    showWelcomeToast();

    if (homeLoadingScreen) {
      setTimeout(() => {
        homeLoadingScreen.style.opacity = '0';
        setTimeout(() => {
          homeLoadingScreen.remove();
          sessionStorage.removeItem('loginSuccess');
        }, 300);
      }, 1500);
    }

  } catch (error) {
    console.error('Error initializing app:', error);
    showToast('error', 'Initialization Error', 'Failed to load the application');

    if (homeLoadingScreen) {
      homeLoadingScreen.remove();
      sessionStorage.removeItem('loginSuccess');
    }
  }
}

// ===== CHAT MODE SWITCHING =====
function setupChatTabs() {
  console.log('🔧 Setting up chat tabs...');
  const tabs = document.querySelectorAll('.chat-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.tab;
      switchChatMode(mode);
    });
  });
}

function switchChatMode(mode) {
  console.log(`Switching to ${mode} mode`);
  
  // Stop typing indicator when switching
  stopTyping();
  clearTimeout(typingTimer);
  
  currentChatMode = mode;
  
  const pinnedSection = document.getElementById('pinnedMessagesSection');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const privateContainer = document.getElementById('privateChatContainer');
  
  if (!privateContainer) {
    console.error('Private chat container not found!');
    return;
  }
  
  // Update active tab
  document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`[data-tab="${mode}"]`);
  if (activeTab) activeTab.classList.add('active');
  
  // ✅ MOBILE FIX: Check if mobile
  const isMobile = window.innerWidth <= 480;
  
  if (mode === 'group') {
    // Show group chat
    if (pinnedSection) {
      pinnedSection.style.display = pinnedSection.querySelector('.pinned-messages')?.children.length > 0 ? 'block' : 'none';
    }
    if (chatMessages) chatMessages.style.display = 'flex';
    if (typingIndicator) typingIndicator.style.display = 'block';
    
    // ✅ MOBILE: Completely hide private chat
    if (isMobile) {
      privateContainer.style.display = 'none';
      privateContainer.style.position = 'absolute';
      privateContainer.style.left = '-9999px';
    } else {
      privateContainer.style.display = 'none';
    }
    
    // Only load if empty (prevent reload)
    if (chatMessages && chatMessages.children.length === 0) {
      loadMessages();
    }
  } else {
    // Show private chat
    if (pinnedSection) pinnedSection.style.display = 'none';
    if (typingIndicator) typingIndicator.style.display = 'none';
    
    // ✅ MOBILE: Completely hide group chat
    if (isMobile) {
      if (chatMessages) {
        chatMessages.style.display = 'none';
        chatMessages.style.position = 'absolute';
        chatMessages.style.left = '-9999px';
      }
      privateContainer.style.display = 'flex';
      privateContainer.style.position = 'relative';
      privateContainer.style.left = '0';
    } else {
      if (chatMessages) chatMessages.style.display = 'none';
      privateContainer.style.display = 'flex';
    }
    
    loadAllUsers();
  }
}

// ===== LOAD ALL USERS =====
async function loadAllUsers() {
  console.log('👥 Loading all users...');
  try {
    const { data: users, error } = await supabaseClient
      .from('users')
      .select('id, username, email, avatar_url, role')
      .neq('id', currentUser.id) // Exclude current user
      .order('username');

    if (error) throw error;

    allUsers = users || [];
    console.log(`✅ Loaded ${allUsers.length} users`);
    renderUsersList();
  } catch (err) {
    console.error('Error loading users:', err);
    showToast('error', 'Error', 'Could not load users');
  }
}

function renderUsersList() {
  const grid = document.getElementById('usersGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (allUsers.length === 0) {
    grid.innerHTML = `
      <div class="no-users-placeholder">
        <i class="fas fa-user-slash"></i>
        <p>No users available</p>
      </div>
    `;
    return;
  }

  // ✅ Sort users: Online first, then users with messages, then alphabetically
  const sortedUsers = [...allUsers].sort((a, b) => {
    const aOnline = onlineUsers.has(a.id);
    const bOnline = onlineUsers.has(b.id);
    const aUnread = unreadMessages.get(a.id) || 0;
    const bUnread = unreadMessages.get(b.id) || 0;

    // Users with messages at top
    if (aUnread > 0 && bUnread === 0) return -1;
    if (aUnread === 0 && bUnread > 0) return 1;

    // Then online users
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    // Then alphabetically
    const aName = a.username || a.email;
    const bName = b.username || b.email;
    return aName.localeCompare(bName);
  });

  sortedUsers.forEach(user => {
    const userCard = document.createElement('div');
    const isOnline = onlineUsers.has(user.id);
    userCard.className = `user-card ${isOnline ? 'online' : ''}`;
    userCard.onclick = () => openPrivateChat(user);

    const displayName = user.username || user.email.split('@')[0];
    const unreadCount = unreadMessages.get(user.id) || 0;

    userCard.innerHTML = `
      <div class="user-card-avatar">
        <img src="${user.avatar_url || 'Assets/pfp2.jpg'}" alt="${displayName}">
      </div>
      <div class="user-card-info">
        <span class="user-card-name">${displayName}</span>
        ${unreadCount > 0 ? `<span class="user-notification-badge">${unreadCount}</span>` : ''}
      </div>
    `;

    grid.appendChild(userCard);
  });

  updatePrivateTabBadge();
}

function updatePrivateTabBadge() {
  const totalUnread = Array.from(unreadMessages.values()).reduce((sum, count) => sum + count, 0);
  const privateTab = document.querySelector('[data-tab="private"]');

  if (!privateTab) return;

  let badge = privateTab.querySelector('.notification-badge');

  if (totalUnread > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'notification-badge';
      privateTab.appendChild(badge);
    }
    badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
  } else {
    if (badge) badge.remove();
  }
}

// ===== PRIVATE CHAT FUNCTIONS =====
function openPrivateChat(user) {
  console.log(`💬 Opening private chat with ${user.username || user.email}`);
  privateChatUser = user;

  clearUnreadInDatabase(user.id);
  const privateUsersList = document.getElementById('privateUsersList');
  const privateChatView = document.getElementById('privateChatView');

  if (!privateUsersList || !privateChatView) {
    console.error('❌ Private chat elements not found!');
    return;
  }

  privateUsersList.style.display = 'none';
  privateChatView.style.display = 'flex';

  const displayName = user.username || user.email.split('@')[0];
  const isOnline = onlineUsers.has(user.id);

  // Update avatar and username
  const privateChatAvatar = document.getElementById('privateChatAvatar');
  const privateChatUsername = document.getElementById('privateChatUsername');
  const privateChatStatus = document.getElementById('privateChatStatus');

  // ✅ Update avatar container class for status dot
  const avatarContainer = privateChatAvatar?.parentElement;
  if (avatarContainer) {
    avatarContainer.className = `private-chat-user-avatar ${isOnline ? 'online' : ''}`;
  }

  if (privateChatAvatar) {
    privateChatAvatar.src = user.avatar_url || 'Assets/pfp2.jpg';
    privateChatAvatar.alt = displayName;
  }

  if (privateChatUsername) {
    privateChatUsername.textContent = displayName;
  }

  if (privateChatStatus) {
    privateChatStatus.textContent = isOnline ? 'Online' : 'Offline';
    privateChatStatus.className = `private-status ${isOnline ? 'online' : ''}`;
  }

  loadPrivateMessages(user.id);
  renderUsersList();
}

async function renderPrivateMessage(message, container = null) {
  if (!container) {
    container = document.getElementById('privateChatMessages');
  }

  const isCurrentUser = message.user_id === currentUser.id;

  // Get sender info
  let senderName = 'Unknown';
  let senderRole = 'user';
  let avatar_url = 'Assets/pfp2.jpg';

  if (isCurrentUser) {
    senderName = getUserDisplayName(currentUser, currentProfile);
    senderRole = currentProfile?.role || 'user';
    avatar_url = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
  } else {
    senderName = privateChatUser?.username || privateChatUser?.email?.split('@')[0] || 'User';
    senderRole = privateChatUser?.role || 'user';
    avatar_url = privateChatUser?.avatar_url || 'Assets/pfp2.jpg';
  }

  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = isCurrentUser
    ? 'message message-sent fade-in'
    : 'message message-received fade-in';
  messageElement.setAttribute('data-message-id', message.id);

  const roleClass = `role-${senderRole}`;
  const roleDisplay = getRoleEmoji(senderRole);

  messageElement.innerHTML = `
    <div class="message-sender">
      <img src="${avatar_url}" alt="${senderName}" class="chat-avatar">
      ${senderName}
      <span class="user-role ${roleClass}">${roleDisplay} ${senderRole}</span>
    </div>
    <div class="message-content">${formatMessage(message.content)}</div>
    <div class="message-actions">
      ${canDeleteMessage(message.user_id, senderRole) ? `
        <button class="message-delete" onclick="deleteMessage('${message.id}')" title="Delete message">
          <i class="fas fa-times"></i>
        </button>
      ` : ''}
    </div>
    <div class="message-time" data-timestamp="${message.sent_at}">${formatTime(new Date(message.sent_at))}</div>
  `;

  // Add hover event listeners for delete button
  messageElement.addEventListener('mouseenter', () => {
    const actions = messageElement.querySelector('.message-actions');
    if (actions) actions.style.opacity = '1';
  });

  messageElement.addEventListener('mouseleave', () => {
    const actions = messageElement.querySelector('.message-actions');
    if (actions) actions.style.opacity = '0';
  });

  container.appendChild(messageElement);
  container.scrollTop = container.scrollHeight;
}

function renderPrivateMessageSync(message, container) {
  const isCurrentUser = message.user_id === currentUser.id;

  let senderName = 'Unknown';
  let senderRole = 'user';
  let avatar_url = 'Assets/pfp2.jpg';

  if (isCurrentUser) {
    senderName = getUserDisplayName(currentUser, currentProfile);
    senderRole = currentProfile?.role || 'user';
    avatar_url = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
  } else {
    senderName = privateChatUser?.username || privateChatUser?.email?.split('@')[0] || 'User';
    senderRole = privateChatUser?.role || 'user';
    avatar_url = privateChatUser?.avatar_url || 'Assets/pfp2.jpg';
  }

  const messageElement = document.createElement('div');
  messageElement.className = isCurrentUser
    ? 'message message-sent fade-in'
    : 'message message-received fade-in';
  messageElement.setAttribute('data-message-id', message.id);

  const roleClass = `role-${senderRole}`;
  const roleDisplay = getRoleEmoji(senderRole);

  messageElement.innerHTML = `
    <div class="message-sender">
      <img src="${avatar_url}" alt="${senderName}" class="chat-avatar">
      ${senderName}
      <span class="user-role ${roleClass}">${roleDisplay} ${senderRole}</span>
    </div>
    <div class="message-content">${formatMessage(message.content)}</div>
    <div class="message-actions">
      ${canDeleteMessage(message.user_id, senderRole) ? `
        <button class="message-delete" onclick="deleteMessage('${message.id}')" title="Delete message">
          <i class="fas fa-times"></i>
        </button>
      ` : ''}
    </div>
    <div class="message-time" data-timestamp="${message.sent_at}">${formatTime(new Date(message.sent_at))}</div>
  `;

  // Add hover effects
  messageElement.addEventListener('mouseenter', () => {
    const actions = messageElement.querySelector('.message-actions');
    if (actions) actions.style.opacity = '1';
  });

  messageElement.addEventListener('mouseleave', () => {
    const actions = messageElement.querySelector('.message-actions');
    if (actions) actions.style.opacity = '0';
  });

  container.appendChild(messageElement);
}

/**
 * Save unread counts to localStorage
 */
function saveUnreadToStorage() {
  const unreadData = {};
  unreadMessages.forEach((count, userId) => {
    if (count > 0) {
      unreadData[userId] = count;
    }
  });
  localStorage.setItem('unreadMessages', JSON.stringify(unreadData));
  console.log('💾 Saved unread counts:', unreadData);
}

/**
 * Load unread counts from localStorage
 */
function loadUnreadFromStorage() {
  try {
    const stored = localStorage.getItem('unreadMessages');
    if (stored) {
      const unreadData = JSON.parse(stored);
      Object.keys(unreadData).forEach(userId => {
        unreadMessages.set(userId, unreadData[userId]);
      });
      console.log('📂 Loaded unread counts:', unreadData);
      updatePrivateTabBadge();
      if (currentChatMode === 'private') {
        renderUsersList();
      }
    }
  } catch (err) {
    console.error('Error loading unread messages:', err);
  }
}

/**
 * Clear unread count for specific user (when chat is opened)
 */
function clearUnreadForUser(userId) {
  unreadMessages.delete(userId);
  saveUnreadToStorage();
  updatePrivateTabBadge();
  if (currentChatMode === 'private') {
    renderUsersList();
  }
  console.log(`✅ Cleared unread for user: ${userId}`);
}

/**
 * Increment unread count for user
 */
function incrementUnreadForUser(userId) {
  const currentCount = unreadMessages.get(userId) || 0;
  unreadMessages.set(userId, currentCount + 1);
  saveUnreadToStorage();
  updatePrivateTabBadge();
  if (currentChatMode === 'private') {
    renderUsersList();
  }
  console.log(`📬 Incremented unread for user: ${userId}, new count: ${currentCount + 1}`);
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

  } catch (error) {
    console.error('Error toggling pin:', error);
    showToast('error', 'Pin Failed', 'Could not update message pin status');

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
    pinnedMessages.forEach(msg => {
      const profile = userProfiles[msg.user_id];
      const senderName = profile?.username || profile?.email?.split('@')[0] || 'Unknown';
      const senderRole = profile?.role || 'user';
      const avatar_url = profile?.avatar_url || 'Assets/pfp2.jpg';

      const pinnedElement = document.createElement('div');
      pinnedElement.className = 'pinned-message';
      pinnedElement.innerHTML = `
        <div class="pinned-user-info">
          <img src="${avatar_url}" alt="${senderName}">
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
  const mobileAvatarImg = document.getElementById('mobileAvatarImg');
  const username = document.getElementById('username');

  const displayName = getUserDisplayName(currentUser, currentProfile);
  username.textContent = displayName;

  // Set avatar image, fallback to default
  let avatar_url = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
  if (userAvatarImg) {
    userAvatarImg.src = avatar_url;
    userAvatarImg.alt = displayName + " avatar";
  }
  if (mobileAvatarImg) {
    mobileAvatarImg.src = avatar_url;
    mobileAvatarImg.alt = displayName + " avatar";
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

    const avatar_url = currentProfile?.avatar_url || '';
    document.getElementById('popImg').src = avatar_url || 'Assets/pfp2.jpg';
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
  console.log('⌨️ handleTyping called - mode:', currentChatMode);

  if (!presenceChannel || !currentUser || !currentProfile) {
    console.warn('⚠️ Typing setup not ready');
    return;
  }

  // ✅ Only send typing in group mode
  if (currentChatMode !== 'group') {
    console.log('⏭️ Not in group mode, skipping typing signal');
    return;
  }

  sendTypingSignal(true);
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    console.log('⏱️ Typing timer expired');
    sendTypingSignal(false);
  }, 3000);
}

function stopTyping() {
  console.log('🛑 stopTyping called');
  clearTimeout(typingTimer);

  // ✅ Only send stop signal if in group mode
  if (currentChatMode === 'group') {
    sendTypingSignal(false);
  }
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

function handleTypingEvent(payload) {
  console.log('🎯 handleTypingEvent called with:', payload);

  if (!payload || !payload.userId) {
    console.error('❌ Invalid typing payload received');
    return;
  }

  // ✅ Only process in group mode
  if (currentChatMode !== 'group') {
    console.log('⏭️ Not in group mode, ignoring typing event');
    return;
  }

  // ✅ Ignore own typing (safety check, even though self:false should handle it)
  if (payload.userId === currentUser?.id) {
    console.log('🔍 This is my own typing signal (shouldn\'t happen with self:false)');
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

  console.log('📊 Current typing users:', Object.keys(usersTyping));
  updateTypingIndicator();
}

/* === MODAL FUNCTIONS === */
// ===============  openPreview  ==================
function openPreview(file) {
  const modal = document.getElementById('previewModal');
  const contentBox = modal.querySelector('.preview-modal-content'); // ⚑ wrapper
  const body = document.getElementById('previewBody');

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
    const img = new Image();
    img.src = url;
    img.alt = filename || 'image preview';
    img.onload = () => contentBox.classList.add('img-fit');   // shrink-wrap
    img.onerror = () => showToast('error', 'Preview failed', 'Can’t load image');
    body.appendChild(img);
  }

  /* ---------- PDF ---------- */
  else if (filetype === 'application/pdf') {
    const frame = document.createElement('iframe');
    frame.src = `${url}#toolbar=0&navpanes=0`;
    frame.loading = 'lazy';
    body.appendChild(frame);
  }

  /* ---------- PLAIN-TEXT ---------- */
  else if (filetype.startsWith('text/')) {
    fetch(url)
      .then(r => r.text())
      .then(txt => {
        const pre = document.createElement('pre');
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
        window.location.href = "../index.html";
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
    'chess': '../games/chess/chess.html',
    'tic-tac-toe': '../games/ttt/index.html',
    'typemaster': '../games/typemaster/index.html',
    'advice': '../games/advice/index.html',
    'whiteboard': '../games/white/index.html',
    'dsasolver': '../games/dsasolver/index.html',
    'quiz': '../games/Quiz/quiz.html',
    'snake': '../games/snake/game.html',
    'Placement': '../pages/Maintenance.html',
  };

  const gameNames = {
    'chess': 'Chess Master',
    'tic-tac-toe': 'Tic Tac Toe',
    'typemaster': 'Type Master',
    'advice': 'Boost Up!',
    'whiteboard': 'Creative Board',
    'dsasolver': 'DSA Solver',
    'quiz': 'Take a QUIZ',
    'snake': 'Snake Reloaded',
    'Placement': 'Aptitude Test'
  };

  let gameModal = document.getElementById('gameModal');
  if (!gameModal) {
    gameModal = document.createElement('div');
    gameModal.id = 'gameModal';
    gameModal.className = 'game-modal';
    gameModal.innerHTML = `
      <div class="game-modal-content">
        <div class="game-modal-header">
          <button class="back-btn-mobile" onclick="closeGame()" aria-label="Back to games">
            <i class="fas fa-arrow-left"></i>
          </button>
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
  if (!history.state || history.state.gameModal !== true) {
    history.pushState({ gameModal: true }, 'Game', '');
  }

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
  if (history.state && history.state.gameModal === true) {
    history.back();
  }
}

function handleGameEscape(e) {
  if (e.key === 'Escape') {
    closeGame();
  }
}

function setupPresenceTracking() {
  console.log('🔗 Setting up presence tracking...');

  presenceChannel = supabaseClient.channel('online-users', {
    config: {
      presence: { key: currentUser.id },
      broadcast: {
        self: false,  // ✅ CRITICAL FIX - Don't receive own broadcasts
        ack: false
      }
    }
  });

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const newState = presenceChannel.presenceState();
      onlineUsers.clear();
      Object.keys(newState).forEach(userId => onlineUsers.add(userId));
      updateOnlineMembers();
      if (currentChatMode === 'private') renderUsersList();
    })
    .on('presence', { event: 'join' }, ({ key }) => {
      onlineUsers.add(key);
      updateOnlineMembers();
      if (currentChatMode === 'private') renderUsersList();
    })
    .on('presence', { event: 'leave' }, ({ key }) => {
      onlineUsers.delete(key);
      updateOnlineMembers();
      if (currentChatMode === 'private') renderUsersList();
    })
    // ✅ FIXED: Proper typing broadcast listener
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      console.log('📨 Received typing broadcast:', payload);

      // Only process in group mode
      if (currentChatMode === 'group') {
        handleTypingEvent(payload);
      }
    })
    .subscribe(async (status) => {
      console.log('Presence channel status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Presence channel subscribed successfully');
        await presenceChannel.track({
          user_id: currentUser.id,
          username: getUserDisplayName(currentUser, currentProfile),
          role: currentProfile?.role || 'user',
          online_at: new Date().toISOString()
        });
      }
    });
}

// ==========================================
// 🎯 MODERN TAB SWITCHER LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

  const chatTabs = document.querySelectorAll('.chat-tab');
  const chatTabsContainer = document.querySelector('.chat-tabs');
  const privateChatContainer = document.getElementById('privateChatContainer');
  const groupChatView = document.getElementById('chatMessages'); // Your group chat container

  chatTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const tabType = this.dataset.tab;

      // Update active tab
      chatTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update slider position
      if (chatTabsContainer) {
        chatTabsContainer.dataset.active = tabType;
      }

      // Switch between group and private chat
      if (tabType === 'group') {
        // Show group chat
        if (groupChatView) {
          groupChatView.style.display = 'flex';
        }
        if (privateChatContainer) {
          privateChatContainer.style.display = 'none';
        }
      } else if (tabType === 'private') {
        // Show private chat
        if (groupChatView) {
          groupChatView.style.display = 'none';
        }
        if (privateChatContainer) {
          privateChatContainer.style.display = 'flex';
        }
      }

      // Optional: Add smooth transition effect
      document.querySelector('.chat-container').style.animation = 'fadeInUp 0.4s ease-out';
    });
  });

  // Initialize: Show group chat by default
  if (chatTabsContainer) {
    chatTabsContainer.dataset.active = 'group';
  }
});


// Chat functionality
async function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const codeInput = document.getElementById('codeInput');
  const codeToggle = document.getElementById('codeToggle');

  let messageText = '';

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

  if (!messageText) {
    console.log('❌ Empty message');
    return;
  }

  console.log('📤 Sending message:', messageText);

  // Clear input
  if (codeToggle.classList.contains('active')) {
    codeInput.value = '';
  } else {
    chatInput.value = '';
  }

  // ✅ FIXED: Correct column names
  const messageData = {
    user_id: currentUser.id,
    content: messageText,
    sent_at: new Date().toISOString()
  };

  if (currentChatMode === 'private' && privateChatUser) {
    messageData.recipient_id = privateChatUser.id;
    console.log('📨 Private message to:', privateChatUser.username || privateChatUser.email);
  } else {
    messageData.recipient_id = null;
    console.log('📢 Group message');
  }

  console.log('📦 Message data:', messageData);

  try {
    const { error } = await supabaseClient
      .from('messages')
      .insert([messageData]);

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Message sent!');

  } catch (error) {
    console.error('❌ Error:', error);
    showToast('error', 'Send Failed', 'Could not send message');

    if (codeToggle.classList.contains('active')) {
      codeInput.value = messageText.replace(/``````/g, '');
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

function setupRealtimeChat() {
  console.log('Setting up realtime chat...');

  chatChannel = supabaseClient
    .channel('public:messages')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      async (payload) => {
        const msg = payload.new;
        console.log('📨 New message received:', msg);

        if (msg.recipient_id === null) {
          // GROUP MESSAGE
          console.log('📢 Group message');
          await handleNewMessage(msg);

        } else {
          // PRIVATE MESSAGE
          const isForMe = msg.recipient_id === currentUser.id;
          const isFromMe = msg.user_id === currentUser.id;

          console.log('📨 Private - isForMe:', isForMe, 'isFromMe:', isFromMe);

          if (isForMe && !isFromMe) {
            if (currentChatMode === 'private' && privateChatUser && privateChatUser.id === msg.user_id) {
              console.log('✅ Rendering in open chat & clearing unread');

              // ✅ Check if we need a date divider for new message
              const container = document.getElementById('privateChatMessages');
              const allMessages = container.querySelectorAll('[data-message-id]');
              let previousMessageDate = null;

              if (allMessages.length > 0) {
                const lastMessage = allMessages[allMessages.length - 1];
                const timeElement = lastMessage.querySelector('.message-time');
                if (timeElement) {
                  previousMessageDate = timeElement.getAttribute('data-timestamp');
                }
              }

              if (shouldShowDateDivider(msg.sent_at, previousMessageDate)) {
                const dateDivider = createDateDivider(msg.sent_at);
                container.appendChild(dateDivider);
              }

              await renderPrivateMessage(msg);
              await clearUnreadInDatabase(msg.user_id);
            } else {
              console.log('🔔 Loading updated unread counts from database');
              await loadUnreadFromDatabase();
            }

          } else if (isFromMe && currentChatMode === 'private' && privateChatUser) {
            console.log('✅ Rendering my sent message');

            // ✅ Check if we need a date divider
            const container = document.getElementById('privateChatMessages');
            const allMessages = container.querySelectorAll('[data-message-id]');
            let previousMessageDate = null;

            if (allMessages.length > 0) {
              const lastMessage = allMessages[allMessages.length - 1];
              const timeElement = lastMessage.querySelector('.message-time');
              if (timeElement) {
                previousMessageDate = timeElement.getAttribute('data-timestamp');
              }
            }

            if (shouldShowDateDivider(msg.sent_at, previousMessageDate)) {
              const dateDivider = createDateDivider(msg.sent_at);
              container.appendChild(dateDivider);
            }

            await renderPrivateMessage(msg);
          }
        }
      }
    )
    .on('postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'messages' },
      (payload) => {
        console.log('🗑️ Message deleted:', payload.old.id);
        handleDeletedMessagePrivate(payload.old.id); // ✅ Updated function
      }
    )
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages' },
      (payload) => {
        console.log('✏️ Message updated:', payload.new.id);

        if (payload.new.recipient_id === null) {
          loadPinnedMessages();
        }

        const messageElement = document.querySelector(`[data-message-id="${payload.new.id}"]`);
        if (messageElement) {
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
      }
    )
    .subscribe();

  console.log('✅ Realtime chat setup complete');
}
function openPrivateChat(user) {
  console.log(`💬 Opening private chat with ${user.username || user.email}`);
  privateChatUser = user;

  // Clear unread count
  clearUnreadInDatabase(user.id);

  const privateUsersList = document.getElementById('privateUsersList');
  const privateChatView = document.getElementById('privateChatView');

  if (!privateUsersList || !privateChatView) {
    console.error('❌ Private chat elements not found!');
    return;
  }

  privateUsersList.style.display = 'none';
  privateChatView.style.display = 'flex';

  const displayName = user.username || user.email.split('@')[0];
  const isOnline = onlineUsers.has(user.id);

  const privateChatAvatar = document.getElementById('privateChatAvatar');
  const privateChatUsername = document.getElementById('privateChatUsername');
  const privateChatStatus = document.getElementById('privateChatStatus');

  if (privateChatAvatar) {
    privateChatAvatar.src = user.avatar_url || 'Assets/pfp2.jpg';
    privateChatAvatar.alt = displayName;
  }

  if (privateChatUsername) {
    privateChatUsername.textContent = displayName;
  }

  if (privateChatStatus) {
    privateChatStatus.textContent = isOnline ? 'Online' : 'Offline';
    privateChatStatus.className = `private-status ${isOnline ? 'online' : 'offline'}`;
  }

  loadPrivateMessages(user.id);
  renderUsersList(); // Refresh to remove badge
}

// ✅ ADD THIS NEW FUNCTION HERE
function backToUsersList() {
  console.log('📋 Returning to users list');

  const privateUsersList = document.getElementById('privateUsersList');
  const privateChatView = document.getElementById('privateChatView');

  if (!privateUsersList || !privateChatView) {
    console.error('Private chat elements not found!');
    return;
  }

  privateChatView.style.display = 'none';
  privateUsersList.style.display = 'block';
  privateChatUser = null;

  const privateChatMessages = document.getElementById('privateChatMessages');
  if (privateChatMessages) {
    privateChatMessages.innerHTML = `
      <div class="empty-chat-placeholder">
        <i class="fas fa-comments"></i>
        <p style="font-size: 1.1rem; font-weight: 500">No messages yet</p>
        <p style="font-size: 0.9rem; opacity: 0.7">Send a message to start the conversation</p>
      </div>
    `;
  }

  console.log('✅ Returned to users list');
}

async function loadPrivateMessages(otherUserId) {
  console.log('Loading private messages with user:', otherUserId);
  const container = document.getElementById('privateChatMessages');

  if (!container) {
    console.error('Private chat messages container not found!');
    return;
  }

  // Show loading state
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: var(--gray);">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
      <p>Loading messages...</p>
    </div>
  `;

  try {
    // Fetch messages
    const { data: messages, error } = await supabaseClient
      .from('messages')
      .select('*')
      .or(`and(user_id.eq.${currentUser.id},recipient_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},recipient_id.eq.${currentUser.id})`)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Error loading private messages:', error);
      throw error;
    }

    console.log(`Loaded ${messages.length} private messages`);

    // Clear container
    container.innerHTML = '';

    // Show empty state if no messages
    if (!messages || messages.length === 0) {
      container.innerHTML = `
        <div class="empty-chat-placeholder">
          <i class="fas fa-comments"></i>
          <p style="font-size: 1.1rem; font-weight: 500;">No messages yet</p>
          <p style="font-size: 0.9rem; opacity: 0.7;">Send a message to start the conversation</p>
        </div>
      `;
      return;
    }

    // ✅ Render messages with date dividers
    messages.forEach((msg, index) => {
      // Check if we need a date divider
      let previousMessageDate = null;
      if (index > 0) {
        previousMessageDate = messages[index - 1].sent_at;
      }

      if (shouldShowDateDivider(msg.sent_at, previousMessageDate)) {
        const dateDivider = createDateDivider(msg.sent_at);
        container.appendChild(dateDivider);
      }

      // Render message (we'll use a sync version)
      renderPrivateMessageSync(msg, container);
    });

    container.scrollTop = container.scrollHeight;

  } catch (err) {
    console.error('Error in loadPrivateMessages:', err);
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--danger);">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <p>Failed to load messages</p>
        <button class="btn btn-outline btn-sm" onclick="loadPrivateMessages('${otherUserId}')" style="margin-top: 1rem;">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
  }
}

function handleDeletedMessagePrivate(messageId) {
  // Check both containers (group and private)
  const groupMessage = document.querySelector(`#chatMessages [data-message-id="${messageId}"]`);
  const privateMessage = document.querySelector(`#privateChatMessages [data-message-id="${messageId}"]`);

  const messageElement = groupMessage || privateMessage;

  if (messageElement) {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(20px)';
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }
}

// ===== DATE DIVIDERS FUNCTIONS =====
function formatDateForDivider(date) {
  const now = new Date();
  const messageDate = new Date(date);

  // Reset time to compare dates only
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

  if (msgDate.getTime() === today.getTime()) {
    return { text: 'Today', class: 'today' };
  } else if (msgDate.getTime() === yesterday.getTime()) {
    return { text: 'Yesterday', class: 'yesterday' };
  } else {
    // Format as "January 15, 2025" or "Jan 15" for current year
    const options = msgDate.getFullYear() === now.getFullYear()
      ? { month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };

    return {
      text: messageDate.toLocaleDateString('en-US', options),
      class: ''
    };
  }
}

function createDateDivider(date) {
  const dateInfo = formatDateForDivider(date);
  const divider = document.createElement('div');
  divider.className = 'date-divider';
  divider.innerHTML = `
    <div class="date-divider-text ${dateInfo.class}">
      ${dateInfo.text}
    </div>
  `;
  return divider;
}

function shouldShowDateDivider(currentMessageDate, previousMessageDate) {
  if (!previousMessageDate) return true;

  const current = new Date(currentMessageDate);
  const previous = new Date(previousMessageDate);

  // Compare dates (ignore time)
  return current.toDateString() !== previous.toDateString();
}

async function handleNewMessage(message) {
  const messagesContainer = document.getElementById('chatMessages');
  const isCurrentUser = message.user_id === currentUser.id;

  // Check if we need a date divider
  const allMessages = messagesContainer.querySelectorAll('[data-message-id]');
  let previousMessageDate = null;

  if (allMessages.length > 0) {
    const lastMessage = allMessages[allMessages.length - 1];
    const timeElement = lastMessage.querySelector('.message-time');
    if (timeElement && timeElement.getAttribute('data-timestamp')) {
      previousMessageDate = timeElement.getAttribute('data-timestamp');
    }
  }

  // Add date divider if needed
  if (shouldShowDateDivider(message.sent_at, previousMessageDate)) {
    const dateDivider = createDateDivider(message.sent_at);
    messagesContainer.appendChild(dateDivider);
  }

  // Rest of your existing handleNewMessage code stays the same...
  let senderName = 'Unknown';
  let senderRole = 'user';
  let avatar_url = 'Assets/pfp2.jpg';

  if (isCurrentUser) {
    senderName = getUserDisplayName(currentUser, currentProfile);
    senderRole = currentProfile?.role || 'user';
    avatar_url = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
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
        avatar_url = profile.avatar_url || 'Assets/pfp2.jpg';
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
      <img src="${avatar_url}" alt="${senderName}" class="chat-avatar">
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
    <div class="message-time" data-timestamp="${message.sent_at}">${formatTime(new Date(message.sent_at))}</div>
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

    // Don't clear innerHTML - this was deleting the typing indicator!
    // Instead, remove only message elements and date dividers
    const messageElements = messagesContainer.querySelectorAll('[data-message-id], .date-divider');
    messageElements.forEach(el => el.remove());

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (!messages || messages.length === 0) {
      messagesContainer.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 2rem;">No messages yet. Be the first to say hello! 👋</p>';
      return;
    }

    // Get user profiles
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

    // Process messages with date dividers
    messages.forEach((msg, index) => {
      // Check if we need a date divider
      let previousMessageDate = null;
      if (index > 0) {
        previousMessageDate = messages[index - 1].sent_at;
      }

      if (shouldShowDateDivider(msg.sent_at, previousMessageDate)) {
        const dateDivider = createDateDivider(msg.sent_at);
        messagesContainer.appendChild(dateDivider);
      }

      // Create and append message (keep your existing message creation logic)
      const isCurrentUser = msg.user_id === currentUser.id;
      const messageElement = document.createElement('div');
      messageElement.className = isCurrentUser ? 'message message-sent fade-in' : 'message message-received fade-in';
      messageElement.setAttribute('data-message-id', msg.id);

      let senderName = 'Unknown', senderRole = 'user', avatar_url = 'Assets/pfp2.jpg';
      if (isCurrentUser) {
        senderName = getUserDisplayName(currentUser, currentProfile);
        senderRole = currentProfile?.role || 'user';
        avatar_url = currentProfile?.avatar_url || 'Assets/pfp2.jpg';
      } else if (userProfiles[msg.user_id]) {
        const profile = userProfiles[msg.user_id];
        senderName = profile.username || profile.email.split('@')[0];
        senderRole = profile.role || 'user';
        avatar_url = profile.avatar_url || 'Assets/pfp2.jpg';
      }

      const roleClass = `role-${senderRole}`;
      const roleDisplay = getRoleEmoji(senderRole);

      messageElement.innerHTML = `
        <div class="message-sender">
          <img src="${avatar_url}" alt="${senderName}" class="chat-avatar">
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
        <div class="message-time" data-timestamp="${msg.sent_at}">${formatTime(new Date(msg.sent_at))}</div>

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
      fileItem.className = 'file-item fade-in';

      fileItem.innerHTML = `
    <div class="file-info" data-clickable="true">
      <i class="fas ${getFileIcon(file.filetype)} file-icon"></i>
      <div class="file-details">
        <div class="file-name" title="${file.filename}">${file.filename}</div>
        <div class="file-meta">${formatFileSize(file.filesize)}</div>
      </div>
    </div>
    <div class="file-actions">
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); downloadFile('${file.filepath}', '${file.filename}')" title="Download file">
        <i class="fas fa-download"></i>
      </button>
      <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteFile('${file.id}', '${file.filepath}', '${file.filename}')" title="Delete file">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

      // Add click handler for preview (only on file info area)
      const fileInfo = fileItem.querySelector('.file-info[data-clickable="true"]');
      fileInfo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPreview(file);
      });

      // Add visual feedback for clickable area
      fileInfo.style.cursor = 'pointer';
      fileInfo.addEventListener('mouseenter', () => {
        fileInfo.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
      });
      fileInfo.addEventListener('mouseleave', () => {
        fileInfo.style.backgroundColor = 'transparent';
      });

      fileContainer.appendChild(fileItem);
    });

  } catch (err) {
    console.error('Error in loadFiles:', err);
  }
}
// Download file without preview
async function downloadFileOnly(filepath, filename) {
  try {
    console.log(`📥 Downloading file: ${filename}`);

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
    console.error('Download error:', err);
    showToast('error', 'Download Failed', 'Could not download file.');
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
    const avatar_url = member.avatar_url || 'Assets/pfp2.jpg';  // ← Show actual profile pic
    const roleEmoji = getRoleEmoji(member.role || 'user');

    memberElement.innerHTML = `
  <div class="member-avatar">
    <img src="${avatar_url}" alt="${displayName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
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
  console.log(`📊 ${typers.length} user(s) currently typing:`, typers);

  if (typers.length === 0) {
    console.log('⏸️ Hiding typing indicator');
    indicator.classList.add('hidden');
    return;
  }

  console.log('✅ Showing typing indicator');

  // Update content based on number of typers
  if (typers.length === 1) {
    const user = typers[0];
    if (nameSpan) nameSpan.textContent = `${user.name} is`;
    if (avatarImg) avatarImg.src = user.avatar;
    console.log(`👤 Single user typing: ${user.name}`);
  } else {
    if (nameSpan) nameSpan.textContent = 'Several people are';
    if (avatarImg) avatarImg.src = 'Assets/pfp2.jpg';
    console.log(`👥 Multiple users typing`);
  }

  // Show indicator
  indicator.classList.remove('hidden');

  // Auto-scroll to show typing indicator
  if (messagesContainer) {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }
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
document.getElementById('profileEditForm').onsubmit = async function (e) {
  e.preventDefault();

  const usernameVal = document.getElementById('editUsername').value;
  const dobVal = document.getElementById('editDob').value;
  const avatarFile = document.getElementById('avatarInput').files[0];

  let avatar_url = currentProfile?.avatar_url || '';

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
    avatar_url = data.publicUrl;
  }

  // Update user profile in your Supabase "users" table
  const { error: upError } = await supabaseClient
    .from('users')
    .update({
      username: usernameVal,
      dob: dobVal,
      avatar_url: avatar_url
    })
    .eq('id', currentUser.id);

  if (!upError) {
    currentProfile.username = usernameVal;
    currentProfile.dob = dobVal;
    currentProfile.avatar_url = avatar_url;
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
window.addEventListener('popstate', function (event) {
  var gameModal = document.getElementById('gameModal');
  // If the modal is open, just close it; DO NOT call history.back() again!
  if (gameModal && gameModal.style.display === 'flex') {
    gameModal.style.display = 'none';
    document.getElementById('gameIframe').src = '';
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleGameEscape);
    // DO NOT call history.back() here!
    return;
  }
  // Else, let normal navigation happen
});