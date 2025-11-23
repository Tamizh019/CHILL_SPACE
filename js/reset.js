        // Initialize Supabase with required headers
        const supabaseUrl = 'https://cmriyjrqkvpdchvbpnne.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcml5anJxa3ZwZGNodmJwbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzcyODYsImV4cCI6MjA2ODQxMzI4Nn0.wWRO5jZuUfrMPV8A3J7j36yweLe4o-uIcSZYaMhY4O8';
        
        const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${supabaseAnonKey}`
                }
            }
        });

        // DOM Elements
        const resetForm = document.getElementById('resetPasswordForm');
        const newPasswordEl = document.getElementById('newPassword');
        const confirmPasswordEl = document.getElementById('confirmPassword');
        const resetBtn = document.getElementById('resetBtn');
        const resetMessage = document.getElementById('resetMessage');

        // Parse URL parameters (including fragment)
        function getTokenFromURL() {
            const url = new URL(window.location.href);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const searchParams = url.searchParams;
            
            // Try hash parameters first
            if (hashParams.get('access_token')) {
                return {
                    accessToken: hashParams.get('access_token'),
                    type: hashParams.get('type')
                };
            }
            // Then try query parameters
            else if (searchParams.get('access_token')) {
                return {
                    accessToken: searchParams.get('access_token'),
                    type: searchParams.get('type')
                };
            }
            return null;
        }

        // Get token parameters
        const tokenParams = getTokenFromURL();
        const accessToken = tokenParams ? tokenParams.accessToken : null;
        const type = tokenParams ? tokenParams.type : null;

        // Initialize token handling
        function initializeReset() {
            if (type === 'recovery' && accessToken) {
                console.log("Recovery token found:", accessToken ? "valid" : "invalid");
                console.log("Token type:", type);
                
                // Store token for password reset
                sessionStorage.setItem('recovery_token', accessToken);
            } else {
                console.error("Invalid reset link parameters - Access Token:", accessToken, "Type:", type);
                showMessage('Invalid reset link. Please request a new one.', 'error');
                disableForm();
            }
        }

        // Initialize on page load
        initializeReset();

        // Password reset handler
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newPassword = newPasswordEl.value;
            const confirmPassword = confirmPasswordEl.value;
            
            // Validate passwords
            if (newPassword.length < 6) {
                showMessage('Password needs at least 6 characters!', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showMessage('Passwords don\'t match', 'error');
                return;
            }

            // Get stored token
            const recoveryToken = sessionStorage.getItem('recovery_token');
            
            if (!recoveryToken) {
                showMessage('Reset token missing. Please request a new link', 'error');
                return;
            }

            resetBtn.disabled = true;
            resetBtn.textContent = 'Updating...';
            
            try {
                console.log("Updating password with token...");
                
                // Update password with token
                const { data, error } = await supabase.auth.updateUser({
                    password: newPassword
                }, {
                    access_token: recoveryToken
                });
                
                if (error) {
                    console.error("Password update error:", error);
                    showMessage(error.message || 'Password update failed', 'error');
                } else {
                    console.log("Password updated successfully!");
                    showMessage('Password updated successfully! Redirecting to login...', 'success');
                    sessionStorage.removeItem('recovery_token');
                    
                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            } catch (error) {
                console.error('Full password reset error:', error);
                showMessage('Something went wrong. Please try again.', 'error');
            } finally {
                resetBtn.disabled = false;
                resetBtn.textContent = 'Update Password';
            }
        });

        // Utility functions
        function showMessage(text, type) {
            resetMessage.textContent = text;
            resetMessage.className = type;
            resetMessage.style.display = 'block';
            
            if (type === 'success') {
                setTimeout(() => {
                    resetMessage.style.display = 'none';
                }, 3000);
            }
        }

        function disableForm() {
            resetBtn.disabled = true;
            newPasswordEl.disabled = true;
            confirmPasswordEl.disabled = true;
        }