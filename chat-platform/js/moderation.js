/**
 * Moderation Module
 * Handles content moderation, spam detection, and enforcement
 */

import {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    where,
    getCurrentUserUID,
    logAuditAction
} from './firebase.js';

// Default bad words list
const DEFAULT_BAD_WORDS = [
    'badword1',
    'badword2',
    'offensive',
    'spam'
];

let badWordsList = [...DEFAULT_BAD_WORDS];
let spamDetectionEnabled = true;
let linkFilterEnabled = true;

/**
 * Check if message violates policies
 */
export async function checkMessageContent(text, userId) {
    const violations = [];
    
    // Check for bad words
    if (badWordsList.some(word => text.toLowerCase().includes(word))) {
        violations.push({
            type: 'bad_words',
            severity: 'medium'
        });
    }
    
    // Check for spam patterns
    if (detectSpam(text)) {
        violations.push({
            type: 'spam',
            severity: 'high'
        });
    }
    
    // Check for suspicious links
    if (linkFilterEnabled && detectSuspiciousLinks(text)) {
        violations.push({
            type: 'suspicious_link',
            severity: 'high'
        });
    }
    
    // Log violations
    if (violations.length > 0) {
        await logViolation(userId, text, violations);
    }
    
    return violations;
}

/**
 * Detect spam in message
 */
function detectSpam(text) {
    // Character repetition
    if (/(.)\1{10,}/.test(text)) return true;
    
    // Excessive capitals
    const caps = (text.match(/[A-Z]/g) || []).length;
    if (caps / text.length > 0.75) return true;
    
    // URLs in message
    if (/http(s)?:\/\//.test(text)) return true;
    
    return false;
}

/**
 * Detect suspicious links
 */
function detectSuspiciousLinks(text) {
    // Look for shortened URLs
    if (/bit\.ly|tinyurl|short\.link/.test(text)) return true;
    
    // Look for suspicious domains
    const suspiciousDomains = ['phishing', 'malware', 'hack'];
    return suspiciousDomains.some(domain => text.toLowerCase().includes(domain));
}

/**
 * Log a violation
 */
async function logViolation(userId, messageContent, violations) {
    try {
        await addDoc(collection(db, 'violations'), {
            userId,
            messageContent: messageContent.substring(0, 200),
            violations,
            timestamp: new Date(),
            reviewed: false,
            action: null
        });
    } catch (error) {
        console.error('Error logging violation:', error);
    }
}

/**
 * Mute user
 */
export async function muteUser(userId, duration = 3600000) {
    try {
        await addDoc(collection(db, 'mutes'), {
            userId,
            mutedAt: new Date(),
            duration,
            expiresAt: new Date(Date.now() + duration),
            active: true
        });
        
        const adminId = getCurrentUserUID();
        await logAuditAction('user_muted', adminId, 'user', userId, {
            duration
        });
        
        return true;
    } catch (error) {
        console.error('Error muting user:', error);
        return false;
    }
}

/**
 * Unmute user
 */
export async function unmuteUser(userId) {
    try {
        const q = query(
            collection(db, 'mutes'),
            where('userId', '==', userId),
            where('active', '==', true)
        );
        
        const snapshot = await getDocs(q);
        for (const doc of snapshot.docs) {
            await updateDoc(doc.ref, { active: false });
        }
        
        const adminId = getCurrentUserUID();
        await logAuditAction('user_unmuted', adminId, 'user', userId);
        
        return true;
    } catch (error) {
        console.error('Error unmuting user:', error);
        return false;
    }
}

/**
 * Check if user is muted
 */
export async function isUserMuted(userId) {
    try {
        const q = query(
            collection(db, 'mutes'),
            where('userId', '==', userId),
            where('active', '==', true)
        );
        
        const snapshot = await getDocs(q);
        
        // Check if any mutes have expired
        for (const doc of snapshot.docs) {
            const mute = doc.data();
            if (mute.expiresAt < new Date()) {
                await updateDoc(doc.ref, { active: false });
            }
        }
        
        return snapshot.docs.length > 0;
    } catch (error) {
        console.error('Error checking mute status:', error);
        return false;
    }
}

/**
 * Warn user
 */
export async function warnUser(userId, reason) {
    try {
        await addDoc(collection(db, 'warnings'), {
            userId,
            reason,
            timestamp: new Date(),
            acknowledged: false
        });
        
        const adminId = getCurrentUserUID();
        await logAuditAction('user_warned', adminId, 'user', userId, {
            reason
        });
        
        return true;
    } catch (error) {
        console.error('Error warning user:', error);
        return false;
    }
}

/**
 * Get user warnings
 */
export async function getUserWarnings(userId) {
    try {
        const q = query(
            collection(db, 'warnings'),
            where('userId', '==', userId)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error getting user warnings:', error);
        return [];
    }
}

/**
 * Auto-moderate message
 */
export async function autoModerateMessage(messageId, text, userId, channelId) {
    const violations = await checkMessageContent(text, userId);
    
    if (violations.length === 0) return true;
    
    const severity = violations[0].severity;
    
    if (severity === 'high') {
        // Delete message and warn user
        await warnUser(userId, `Message violates policy: ${violations[0].type}`);
        return false;
    } else if (severity === 'medium') {
        // Warn user
        await warnUser(userId, `Message contains: ${violations[0].type}`);
        return true;
    }
    
    return true;
}

/**
 * Initialize moderation panel
 */
export function initModeration() {
    const enableSpamDetection = document.getElementById('spamDetection');
    const enableBadWords = document.getElementById('badWordsFilter');
    const enableLinkFilter = document.getElementById('linkFilter');
    
    if (enableSpamDetection) {
        enableSpamDetection.addEventListener('change', (e) => {
            spamDetectionEnabled = e.target.checked;
        });
    }
    
    if (enableBadWords) {
        enableBadWords.addEventListener('change', (e) => {
            // Handle bad words list
        });
    }
    
    if (enableLinkFilter) {
        enableLinkFilter.addEventListener('change', (e) => {
            linkFilterEnabled = e.target.checked;
        });
    }
}

console.log('Moderation module loaded');
