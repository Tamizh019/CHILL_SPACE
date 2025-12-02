// Particle.js configuration
window.addEventListener('load', function () {
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
const supabase = window.supabaseClient;

// Register Form Handler
document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const msgEl = document.getElementById('registerMessage');
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    msgEl.style.display = 'none';

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const pwd = document.getElementById('password').value;
    const conPwd = document.getElementById('confirmPassword').value;

    // Validation
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        showMsg('Username must be 3-20 characters (letters, numbers, underscores)', 'error');
        shakeCard();
        return;
    }
    if (pwd !== conPwd) {
        showMsg('Passwords don\'t match', 'error');
        shakeCard();
        return;
    }
    if (pwd.length < 6) {
        showMsg('Password needs at least 6 characters!', 'error');
        shakeCard();
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    try {
        // Check username availability
        const { data: userExists } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (userExists) {
            showMsg('Username already taken', 'error');
            shakeCard();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }

        // Create user
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pwd,
            options: {
                data: { username }
            }
        });

        if (error) throw error;

        showMsg('Welcome to the crew! Verify your email 📧', 'success');

        // Success Animation
        document.querySelector('.glass-hero').style.opacity = '0.5';

        setTimeout(() => location.href = '../index.html', 2000);

    } catch (error) {
        console.error('Registration error:', error);
        showMsg(error.message || 'Registration failed', 'error');
        shakeCard();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Helper Functions
function showMsg(txt, type) {
    const m = document.getElementById('registerMessage');
    m.textContent = txt;
    // Use the new status-message classes from index.css
    m.className = 'status-message ' + type;
    m.style.display = 'block';
}

function shakeCard() {
    const card = document.querySelector('.glass-hero');
    card.classList.add('error-shake');
    setTimeout(() => card.classList.remove('error-shake'), 500);
}
