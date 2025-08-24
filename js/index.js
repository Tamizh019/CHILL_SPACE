// Particle.js configuration (keep as is)
window.addEventListener('load', function() {
    particlesJS("particles-js", {
        particles: {
            number: { 
                value: window.innerWidth < 768 ? 80 : 150,
                density: { enable: true, value_area: 1200 } 
            },
            color: { value: ["#ffffff", "#f0f8ff", "#e6f3ff", "#ffd700"] },
            shape: { 
                type: "star",
                stroke: { width: 0, color: "#000000" },
                polygon: { nb_sides: 5 }
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: { enable: true, speed: 2, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 2,
                random: true,
                anim: { enable: true, speed: 3, size_min: 0.5, sync: false }
            },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 0.3,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: { enable: false }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "bubble" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                bubble: { distance: 150, size: 8, duration: 1.5, opacity: 1, speed: 2 },
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 3 },
                grab: { distance: 200, line_linked: { opacity: 0.8 } }
            }
        },
        retina_detect: true
    });
});

// Initialize Supabase
const supabaseUrl = 'https://cmriyjrqkvpdchvbpnne.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcml5anJxa3ZwZGNodmJwbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzcyODYsImV4cCI6MjA2ODQxMzI4Nn0.wWRO5jZuUfrMPV8A3J7j36yweLe4o-uIcSZYaMhY4O8';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Random Quotes Array
const inspirationalQuotes = [
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House"
    },
    {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson"
    },
    {
        text: "Experience is the name everyone gives to their mistakes.",
        author: "Oscar Wilde"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci"
    },
    {
        text: "Talk is cheap. Show me the code.",
        author: "Linus Torvalds"
    },
    {
        text: "Programs must be written for people to read, and only incidentally for machines to execute.",
        author: "Harold Abelson"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    // 🌟 Fun + inspirational additions
    {
        text: "Keep calm and Enjoy .",
        author: "Unknown"
    },
    {
        text: "Behind every great app is a lot of coffee ☕ and late nights.",
        author: "Unknown"
    },
    {
        text: "Dream big. Start small. Work daily.",
        author: "Unknown"
    },
    {
        text: "Bugs are just unexpected features waiting for love 🐞❤️.",
        author: "Unknown"
    },
    {
        text: "Your vibe attracts your tribe. Keep it positive ✨.",
        author: "Unknown"
    },
    {
        text: "Don’t just chase success, build something worth remembering.",
        author: "Unknown"
    },
    {
        text: "Great things are built one commit at a time.",
        author: "Unknown"
    },
    {
        text: "Stay weird. The world needs your uniqueness .",
        author: "Unknown"
    },
    {
        text: "Code hard, nap harder 😴.",
        author: "Unknown"
    },
    {
        text: "Be the glitch you want to see in the matrix.",
        author: "Unknown"
    }
];


// ✅ FIXED: Single Loading Screen Function
function showLoadingScreenWithQuote() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    
    if (!loadingOverlay) {
        console.error('Loading overlay not found!');
        return;
    }
    
    // Select random quote
    const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
    
    // Update quote content
    if (quoteText) quoteText.textContent = `"${randomQuote.text}"`;
    if (quoteAuthor) quoteAuthor.textContent = `— ${randomQuote.author}`;
    
    // Show loading screen
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
}

function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
}

// ✅ FIXED: Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('loginMessage');
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    
    // Reset message
    messageEl.style.display = 'none';
    
    // Disable login button
    const originalText = loginBtn.textContent;
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    try {
        console.log('Attempting login with:', email); // Debug log
        
        const { data, error } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
        });
        
        if (error) {
            console.error('Login error:', error);
            showMessage(messageEl, error.message, 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
            return;
        }
        
        console.log('Login successful:', data); // Debug log
        
        if (!data.user.email_confirmed_at) {
            showMessage(messageEl, 'Please verify your email before logging in.', 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
            return;
        }
        
        // ✅ SUCCESS: Show loading screen immediately
        showLoadingScreenWithQuote();
        
        // Dim the login form
        document.querySelector('.login-container').style.opacity = '0.3';
        
        // Set session storage flag
        sessionStorage.setItem('loginSuccess', 'true');
        
        // Redirect to home page after loading screen duration
        setTimeout(() => {
            window.location.href = 'pages/home.html';
        }, 3500); // 3.5 seconds to enjoy the loading screen
        
    } catch (error) {
        console.error('Unexpected login error:', error);
        showMessage(messageEl, 'An unexpected error occurred. Please try again.', 'error');
        loginBtn.disabled = false;
        loginBtn.textContent = originalText;
    }
});

// Google OAuth
document.getElementById('googleBtn').addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/pages/home.html'
        }
    });
    if (error) console.error('Google OAuth error:', error.message);
});

// Forgot Password Modal Functions
function showForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'flex';
    document.getElementById('resetEmail').focus();
}

function hideForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'none';
    document.getElementById('forgotPasswordForm').reset();
    document.getElementById('resetMessage').style.display = 'none';
}

// Handle forgot password form submission
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    const resetBtn = document.getElementById('resetBtn');
    const resetMessage = document.getElementById('resetMessage');
    
    if (!email) {
        showMessage(resetMessage, 'Please enter your email address', 'error');
        return;
    }

    resetBtn.disabled = true;
    resetBtn.textContent = 'Sending...';
    
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://tamizh-loginpage.netlify.app/pages/reset-password.html'
        });
        
        if (error) {
            showMessage(resetMessage, error.message, 'error');
        } else {
            showMessage(resetMessage, 'Magic link sent! Check your email 📧', 'success');
            document.getElementById('resetEmail').value = '';
        }
    } catch (error) {
        showMessage(resetMessage, 'An error occurred. Please try again.', 'error');
        console.error('Password reset error:', error);
    } finally {
        resetBtn.disabled = false;
        resetBtn.textContent = 'Send Magic Link';
    }
});

// Close modal when clicking outside
document.getElementById('forgotPasswordModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideForgotPasswordModal();
    }
});

// Utility function to show messages
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = type;
    element.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5500);
    }
}

// ✅ REMOVED: Conflicting DOMContentLoaded loading screen
// The loading screen will only show after successful login now
