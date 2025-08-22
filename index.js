                // Particle.js configuration
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



        // Initialize Supabase
        const supabaseUrl = 'https://cmriyjrqkvpdchvbpnne.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcml5anJxa3ZwZGNodmJwbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzcyODYsImV4cCI6MjA2ODQxMzI4Nn0.wWRO5jZuUfrMPV8A3J7j36yweLe4o-uIcSZYaMhY4O8';
        const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

        // Login form handler
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const messageEl = document.getElementById('loginMessage');
            
            // Reset message
            messageEl.style.display = 'none';
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ 
                    email, 
                    password 
                });
                
                if (error) {
                    showMessage(messageEl, error.message, 'error');
                    return;
                }
                
                if (!data.user.email_confirmed_at) {
                    showMessage(messageEl, 'Verify your email before logging in.', 'error');
                    return;
                }
                
                showMessage(messageEl, 'Welcome back to Chill Space! 😎', 'success');
                
                // Redirect to home page after a delay
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } catch (error) {
                showMessage(messageEl, 'An error occurred. Please try again.', 'error');
                console.error('Login error:', error);
            }
        });
                // ── Google sign-in ─────────────────────────────────────────────
document.getElementById('googleBtn').addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback'
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
            // Clear form and message
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

            // Disable button and show loading
            resetBtn.disabled = true;
            resetBtn.textContent = 'Sending...';
            
            try {
                const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: 'https://tamizh-loginpage.netlify.app/reset-password.html'
                });
                
                if (error) {
                    showMessage(resetMessage, error.message, 'error');
                } else {
                    showMessage(resetMessage, 'Magic link sent! Check your email 📧', 'success');
                    // Clear the form
                    document.getElementById('resetEmail').value = '';
                }
            } catch (error) {
                showMessage(resetMessage, 'An error occurred. Please try again.', 'error');
                console.error('Password reset error:', error);
            } finally {
                // Re-enable button
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
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    element.style.display = 'none';
                }, 5500);
            }
        }
        const params = new URLSearchParams(window.location.hash.slice(1));
        const type = params.get("type");
