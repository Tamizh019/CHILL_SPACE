// Particle.js configuration for stars
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
            line_linked: {
                enable: false
            },
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
                bubble: { 
                    distance: 150, 
                    size: 8, 
                    duration: 1.5, 
                    opacity: 1, 
                    speed: 2 
                },
                repulse: { 
                    distance: 100, 
                    duration: 0.4 
                },
                push: { 
                    particles_nb: 3 
                },
                grab: { 
                    distance: 200, 
                    line_linked: { opacity: 0.8 } 
                }
            }
        },
        retina_detect: true
    });
});

// Disable unwanted swipe gestures
document.addEventListener('touchstart', function(e) {
    if(e.touches.length > 1) return false;
});

// Lock horizontal scrolling
document.body.style.overflowX = 'hidden';


const supabase = window.supabase.createClient(
    'https://cmriyjrqkvpdchvbpnne.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcml5anJxa3ZwZGNodmJwbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzcyODYsImV4cCI6MjA2ODQxMzI4Nn0.wWRO5jZuUfrMPV8A3J7j36yweLe4o-uIcSZYaMhY4O8'
);

document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const msgEl = document.getElementById('registerMessage');
    msgEl.style.display = 'none';
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const pwd = document.getElementById('password').value;
    const conPwd = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        showMsg('Username must be 3-20 characters (letters, numbers, underscores)', 'error');
        return;
    }
    if (pwd !== conPwd) {
        showMsg('Passwords don\'t match', 'error');
        return;
    }
    if (pwd.length < 6) {
        showMsg('Password needs at least 6 characters!', 'error');
        return;
    }
    
    try {
        // Check username availability
        const { data: userExists } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();
        
        if (userExists) {
            showMsg('Username already taken', 'error');
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
        setTimeout(() => location.href = 'index.html', 2000);
    } catch (error) {
        showMsg(error.message || 'Registration failed', 'error');
    }
});

function showMsg(txt, type) {
    const m = document.getElementById('registerMessage');
    m.textContent = txt;
    m.className = type;
    m.style.display = 'block';
}
