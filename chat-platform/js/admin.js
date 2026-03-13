/**
 * Admin Dashboard Module
 * Handles admin panel functionality and user management
 */

import {
    db,
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    addDoc,
    getCurrentUserUID,
    logAuditAction
} from './firebase.js';

import { handleLogout } from './auth.js';

/**
 * Initialize admin dashboard
 */
export function initAdmin() {
    if (!document.getElementById('adminPage')) return;
    
    // Check admin access
    checkAdminAccess();
    
    // Setup navigation
    setupAdminNav();
    
    // Load dashboard data
    loadDashboardData();
    
    // Load users
    loadUsers();
    
    // Load servers
    loadServersAdmin();
    
    // Load reports
    loadReports();
    
    // Logout handler
    document.getElementById('adminLogoutBtn')?.addEventListener('click', handleLogout);
}

/**
 * Check if user has admin access
 */
async function checkAdminAccess() {
    const userId = getCurrentUserUID();
    if (!userId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
            window.location.href = 'app.html';
        }
    } catch (error) {
        console.error('Error checking admin access:', error);
        window.location.href = 'index.html';
    }
}

/**
 * Setup admin navigation
 */
function setupAdminNav() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const section = item.dataset.section;
            
            // Update active nav item
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update active section
            document.querySelectorAll('.admin-section').forEach(s => {
                s.classList.remove('active');
            });
            
            const sectionEl = document.getElementById(section + 'Section');
            if (sectionEl) {
                sectionEl.classList.add('active');
                
                // Load section-specific data
                if (section === 'users') loadUsers();
                if (section === 'servers') loadServersAdmin();
                if (section === 'reports') loadReports();
                if (section === 'analytics') loadAnalytics();
                if (section === 'logs') loadAuditLogs();
            }
            
            // Update page title
            document.getElementById('sectionTitle').textContent = 
                item.textContent.trim().split(/\s+/).slice(0, 1).join(' ');
        });
    });
}

/**
 * Load dashboard statistics
 */
async function loadDashboardData() {
    try {
        // Get total users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        document.getElementById('totalUsers').textContent = usersSnapshot.size;
        
        // Get active users
        const activeUsersSnapshot = await getDocs(query(
            collection(db, 'users'),
            where('status', '==', 'online')
        ));
        document.getElementById('activeUsers').textContent = activeUsersSnapshot.size;
        
        // Get total servers
        const serversSnapshot = await getDocs(collection(db, 'servers'));
        document.getElementById('totalServers').textContent = serversSnapshot.size;
        
        console.log('Dashboard data loaded');
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

/**
 * Load users for admin panel
 */
async function loadUsers() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersTable = document.getElementById('usersTable')?.querySelector('tbody');
        
        if (!usersTable) return;
        
        usersTable.innerHTML = '';
        
        usersSnapshot.forEach((doc) => {
            const user = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}...</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.status === 'online' ? 'active' : 'inactive'}">${user.status}</span></td>
                <td>${user.role}</td>
                <td>${user.createdAt?.toDate?.().toLocaleDateString() || '-'}</td>
                <td class="action-buttons">
                    <button class="btn-action" onclick="adminViewUser('${doc.id}')">View</button>
                    ${user.role !== 'admin' ? `<button class="btn-action danger" onclick="adminBanUser('${doc.id}')">Ban</button>` : ''}
                    <button class="btn-action danger" onclick="adminDeleteUser('${doc.id}')">Delete</button>
                </td>
            `;
            usersTable.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

/**
 * Load servers for admin panel
 */
async function loadServersAdmin() {
    try {
        const serversSnapshot = await getDocs(collection(db, 'servers'));
        const serversTable = document.getElementById('serversTable')?.querySelector('tbody');
        
        if (!serversTable) return;
        
        serversTable.innerHTML = '';
        
        serversSnapshot.forEach((doc) => {
            const server = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}...</td>
                <td>${server.name}</td>
                <td>${server.ownerId?.substring(0, 8) || '-'}...</td>
                <td>${server.members?.length || 0}</td>
                <td>${server.channels?.length || 0}</td>
                <td>${server.createdAt?.toDate?.().toLocaleDateString() || '-'}</td>
                <td class="action-buttons">
                    <button class="btn-action" onclick="adminViewServer('${doc.id}')">View</button>
                    <button class="btn-action danger" onclick="adminDeleteServer('${doc.id}')">Delete</button>
                </td>
            `;
            serversTable.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading servers:', error);
    }
}

/**
 * Load reports
 */
async function loadReports() {
    try {
        const reportsSnapshot = await getDocs(collection(db, 'reports'));
        const reportsTable = document.getElementById('reportsTable')?.querySelector('tbody');
        
        if (!reportsTable) return;
        
        reportsTable.innerHTML = '';
        let pendingCount = 0;
        
        reportsSnapshot.forEach((doc) => {
            const report = doc.data();
            if (report.status === 'pending') pendingCount++;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}...</td>
                <td>${report.reporterName || 'Unknown'}</td>
                <td>${report.targetType}</td>
                <td>${report.targetId?.substring(0, 8) || '-'}...</td>
                <td>${report.reason}</td>
                <td>${report.createdAt?.toDate?.().toLocaleDateString() || '-'}</td>
                <td><span class="status-badge ${report.status === 'pending' ? 'pending' : 'resolved'}">${report.status}</span></td>
                <td class="action-buttons">
                    <button class="btn-action" onclick="adminViewReport('${doc.id}')">View</button>
                    ${report.status === 'pending' ? `<button class="btn-action success" onclick="adminResolveReport('${doc.id}')">Resolve</button>` : ''}
                </td>
            `;
            reportsTable.appendChild(row);
        });
        
        // Update badge
        document.getElementById('reportBadge').textContent = pendingCount;
        
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

/**
 * Load analytics
 */
async function loadAnalytics() {
    console.log('Loading analytics...');
    // Chart.js would be used here to display charts
}

/**
 * Load audit logs
 */
async function loadAuditLogs() {
    try {
        const logsSnapshot = await getDocs(
            query(collection(db, 'auditLogs'))
        );
        
        const logsTable = document.getElementById('logsTable')?.querySelector('tbody');
        if (!logsTable) return;
        
        logsTable.innerHTML = '';
        
        logsSnapshot.forEach((doc) => {
            const log = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.timestamp?.toDate?.().toLocaleString() || '-'}</td>
                <td>${log.adminName || 'Unknown'}</td>
                <td>${log.action}</td>
                <td>${log.targetId?.substring(0, 8) || '-'}...</td>
                <td>${JSON.stringify(log.details || {})}</td>
            `;
            logsTable.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading audit logs:', error);
    }
}

/**
 * Admin - Ban user
 */
window.adminBanUser = async (userId) => {
    if (!confirm('Ban this user?')) return;
    
    try {
        await updateDoc(doc(db, 'users', userId), {
            banned: true,
            bannedAt: new Date()
        });
        
        const adminId = getCurrentUserUID();
        await logAuditAction('user_banned', adminId, 'user', userId);
        
        loadUsers();
        alert('User banned successfully');
    } catch (error) {
        console.error('Error banning user:', error);
    }
};

/**
 * Admin - Delete user
 */
window.adminDeleteUser = async (userId) => {
    if (!confirm('Permanently delete this user?')) return;
    
    try {
        await deleteDoc(doc(db, 'users', userId));
        
        const adminId = getCurrentUserUID();
        await logAuditAction('user_deleted', adminId, 'user', userId);
        
        loadUsers();
        alert('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

/**
 * Admin - Delete server
 */
window.adminDeleteServer = async (serverId) => {
    if (!confirm('Delete this server and all its content?')) return;
    
    try {
        await deleteDoc(doc(db, 'servers', serverId));
        
        const adminId = getCurrentUserUID();
        await logAuditAction('server_deleted', adminId, 'server', serverId);
        
        loadServersAdmin();
        alert('Server deleted successfully');
    } catch (error) {
        console.error('Error deleting server:', error);
    }
};

/**
 * Admin - Resolve report
 */
window.adminResolveReport = async (reportId) => {
    try {
        await updateDoc(doc(db, 'reports', reportId), {
            status: 'resolved',
            resolvedAt: new Date()
        });
        
        loadReports();
        alert('Report resolved');
    } catch (error) {
        console.error('Error resolving report:', error);
    }
};

// Make functions available globally
window.adminViewUser = (userId) => {
    alert('User details for ' + userId);
};

window.adminViewServer = (serverId) => {
    alert('Server details for ' + serverId);
};

window.adminViewReport = (reportId) => {
    alert('Report details for ' + reportId);
};

console.log('Admin module loaded');
