/**
 * Firebase Configuration Module
 * Initializes Firebase and exports database references
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { 
    getAuth, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    query, 
    where, 
    getDocs,
    updateDoc,
    deleteDoc,
    addDoc,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js';
import { 
    getDatabase, 
    ref as dbRef, 
    set, 
    get, 
    update,
    remove,
    onValue
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

// Firebase configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyArshAzJuVtJSE0PODFwZfV7IjvpxWM6xg",
  authDomain: "eia-chat-app-71278.firebaseapp.com",
  projectId: "eia-chat-app-71278",
  storageBucket: "eia-chat-app-71278.firebasestorage.app",
  messagingSenderId: "200037607515",
  appId: "1:200037607515:web:99fea8aa99a35663c5777e",
  measurementId: "G-1NB49LF2QQ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Realtime Database
export const rtdb = getDatabase(app);

// Export Firestore functions
export {
    collection,
    doc,
    setDoc,
    getDoc,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    addDoc,
    onSnapshot
};

// Export Storage functions
export {
    ref,
    uploadBytes,
    getDownloadURL
};

// Export Realtime Database functions
export {
    dbRef,
    set,
    get,
    update,
    remove,
    onValue
};

// Export Auth functions
export {
    onAuthStateChanged
};

/**
 * Helper function to get current user UID
 */
export function getCurrentUserUID() {
    return auth.currentUser?.uid;
}

/**
 * Helper function to check if user is authenticated
 */
export function isUserAuthenticated() {
    return auth.currentUser !== null;
}

/**
 * Helper function to get current user data
 */
export async function getCurrentUserData() {
    const uid = getCurrentUserUID();
    if (!uid) return null;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

/**
 * Helper function to check if user is admin
 */
export async function isUserAdmin() {
    const userData = await getCurrentUserData();
    return userData?.role === 'admin';
}

/**
 * Helper function to upload file to storage
 */
export async function uploadFile(path, file) {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

/**
 * Helper function to log audit action
 */
export async function logAuditAction(action, adminId, targetType, targetId, details = {}) {
    try {
        await addDoc(collection(db, 'auditLogs'), {
            action,
            adminId,
            targetType,
            targetId,
            details,
            timestamp: new Date(),
            ipAddress: 'CLIENT_IP' // Should be obtained from server
        });
    } catch (error) {
        console.error('Error logging audit action:', error);
    }
}

/**
 * Helper function to create notification
 */
export async function createNotification(userId, type, title, message, data = {}) {
    try {
        await addDoc(collection(db, 'notifications'), {
            userId,
            type,
            title,
            message,
            data,
            read: false,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

console.log('Firebase initialized successfully');
