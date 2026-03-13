/**
 * Authentication Module
 * Handles login, signup, password reset, and user sessions
 */

import {
    auth,
    db,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    getCurrentUserUID,
    isUserAuthenticated
} from './firebase.js';

import {
    createUserWithEmailAndPassword as createUser,
    signInWithEmailAndPassword as signIn,
    signOut as logout,
    sendPasswordResetEmail as resetEmail
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

/**
 * Handle Login
 */
window.handleLogin = async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('authMessage');
    
    try {
        messageDiv.textContent = 'Logging in...';
        messageDiv.className = 'auth-message';
        
        // Sign in with email and password
        const userCredential = await signIn(auth, email, password);
        const user = userCredential.user;
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
            throw new Error('User profile not found');
        }
        
        const userData = userDoc.data();
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            ...userData
        }));
        
        // Redirect based on role
        if (userData.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'app.html';
        }
        
    } catch (error) {
        messageDiv.textContent = error.message || 'Login failed';
        messageDiv.className = 'auth-message error';
        console.error('Login error:', error);
    }
};

/**
 * Handle Signup
 */
window.handleSignup = async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const messageDiv = document.getElementById('authMessage');
    
    try {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        
        messageDiv.textContent = 'Creating account...';
        messageDiv.className = 'auth-message';
        
        // Create user account
        const userCredential = await createUser(auth, email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        const userProfile = {
            uid: user.uid,
            username,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: '',
            status: 'online',
            role: 'user',
            createdAt: new Date(),
            lastSeen: new Date(),
            verified: false,
            banned: false,
            mutedServers: [],
            blockedUsers: []
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfile);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userProfile));
        
        messageDiv.textContent = 'Account created! Redirecting...';
        messageDiv.className = 'auth-message success';
        
        // Redirect to app
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1500);
        
    } catch (error) {
        messageDiv.textContent = error.message || 'Signup failed';
        messageDiv.className = 'auth-message error';
        console.error('Signup error:', error);
    }
};

/**
 * Handle Password Reset
 */
window.handlePasswordReset = async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const messageDiv = document.getElementById('authMessage');
    
    try {
        messageDiv.textContent = 'Sending reset email...';
        messageDiv.className = 'auth-message';
        
        await resetEmail(auth, email);
        
        messageDiv.textContent = 'Password reset email sent! Check your inbox.';
        messageDiv.className = 'auth-message success';
        
        // Reset form
        document.getElementById('resetForm').reset();
        
        // Show login form after 2 seconds
        setTimeout(() => {
            showLoginForm();
        }, 2000);
        
    } catch (error) {
        messageDiv.textContent = error.message || 'Reset failed';
        messageDiv.className = 'auth-message error';
        console.error('Reset error:', error);
    }
};

/**
 * Toggle between login and signup forms
 */
window.toggleForm = () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
    
    // Clear message
    document.getElementById('authMessage').textContent = '';
};

/**
 * Show password reset form
 */
window.showPasswordReset = () => {
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    
    loginForm.classList.remove('active');
    resetForm.classList.add('active');
    
    document.getElementById('authMessage').textContent = '';
};

/**
 * Show login form
 */
window.showLoginForm = () => {
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    
    loginForm.classList.add('active');
    resetForm.classList.remove('active');
    
    document.getElementById('authMessage').textContent = '';
};

/**
 * Handle Logout
 */
export async function handleLogout() {
    try {
        await logout(auth);
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

/**
 * Check authentication status and protect pages
 */
onAuthStateChanged(auth, async (user) => {
    // Check if we're on a protected page
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['app.html', 'admin.html'];
    
    if (protectedPages.includes(currentPage) || protectedPages.includes(currentPage || 'index.html')) {
        if (!user) {
            // User not authenticated - redirect to login
            if (currentPage !== 'index.html') {
                window.location.href = 'index.html';
            }
        } else {
            // User is authenticated
            try {
                // Check if user exists in Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                
                if (!userDoc.exists()) {
                    // Create user profile if it doesn't exist
                    const userProfile = {
                        uid: user.uid,
                        username: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
                        bio: '',
                        status: 'online',
                        role: 'user',
                        createdAt: new Date(),
                        lastSeen: new Date(),
                        verified: false,
                        banned: false
                    };
                    
                    await setDoc(doc(db, 'users', user.uid), userProfile);
                }
                
                // Update last seen
                await updateDoc(doc(db, 'users', user.uid), {
                    lastSeen: new Date(),
                    status: 'online'
                });
                
            } catch (error) {
                console.error('Error updating user status:', error);
            }
            
            // Check if accessing admin page
            if (currentPage === 'admin.html') {
                const userData = await getDoc(doc(db, 'users', user.uid));
                if (userData.data()?.role !== 'admin') {
                    // Not an admin - redirect to app
                    window.location.href = 'app.html';
                }
            }
        }
    }
});

/**
 * Update user status
 */
export async function updateUserStatus(status) {
    const uid = getCurrentUserUID();
    if (!uid) return;
    
    try {
        await updateDoc(doc(db, 'users', uid), {
            status: status
        });
    } catch (error) {
        console.error('Error updating user status:', error);
    }
}

/**
 * Update user last seen
 */
export async function updateLastSeen() {
    const uid = getCurrentUserUID();
    if (!uid) return;
    
    try {
        await updateDoc(doc(db, 'users', uid), {
            lastSeen: new Date()
        });
    } catch (error) {
        console.error('Error updating last seen:', error);
    }
}

// Update last seen every 5 minutes
setInterval(updateLastSeen, 5 * 60 * 1000);

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        updateUserStatus('idle');
    } else {
        updateUserStatus('online');
        updateLastSeen();
    }
});

console.log('Authentication module loaded');
