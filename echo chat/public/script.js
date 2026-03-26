import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfFJ9UOzF1n7FH3pimUdc9WiXeXe9PZiY",
  authDomain: "my-project-10bd5.firebaseapp.com",
  projectId: "my-project-10bd5",
  storageBucket: "my-project-10bd5.firebasestorage.app",
  messagingSenderId: "477236402256",
  appId: "1:477236402256:web:483e17b0254b8d9aea9955",
  measurementId: "G-69XBTG36WM"
};

const TENOR_KEY = "AIzaSyDVGpa-xoE0MbB272-ZYL_mk3lK1AMKpRY";
const ADMIN_EMAIL = "YOUR_EMAIL@GMAIL.COM"; // <-- SET THIS TO YOUR EMAIL

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
let currentGroupId = "global";

// Auth Tracking
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('user-avatar').src = user.photoURL;
        document.getElementById('user-avatar').classList.remove('hidden');
        if(user.email === ADMIN_EMAIL) document.getElementById('admin-link').classList.remove('hidden');
        loadGroups();
        switchChat("global", "global-echo");
    } else {
        document.getElementById('login-overlay').classList.remove('hidden');
    }
});

// Login/Logout
document.getElementById('google-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth);

// Messaging
function switchChat(id, name) {
    currentGroupId = id;
    document.getElementById('chat-title').innerText = `# ${name}`;
    const q = query(collection(db, "messages"), where("groupId", "==", id), orderBy("createdAt", "asc"));
    onSnapshot(q, (snap) => {
        const container = document.getElementById('messages-container');
        container.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            const wrapper = document.createElement('div');
            wrapper.className = `msg-wrapper ${d.uid === currentUser.uid ? 'my-msg' : ''}`;
            wrapper.innerHTML = `
                <img src="${d.photoURL}" class="msg-avatar">
                <div class="msg-bubble">${d.type === 'gif' ? `<img src="${d.content}" class="gif-content">` : d.text}</div>
            `;
            container.appendChild(wrapper);
        });
        container.scrollTop = container.scrollHeight;
    });
}

document.getElementById('message-form').onsubmit = async (e) => {
    e.preventDefault();
    const text = document.getElementById('message-input').value;
    if(!text.trim()) return;
    await addDoc(collection(db, "messages"), {
        text, type: "text", groupId: currentGroupId, uid: currentUser.uid, 
        photoURL: currentUser.photoURL, createdAt: serverTimestamp()
    });
    document.getElementById('message-input').value = '';
};

// Tenor GIFs
document.getElementById('gif-trigger').onclick = () => document.getElementById('gif-menu').classList.toggle('hidden');
document.getElementById('gif-search').oninput = async (e) => {
    const res = await fetch(`https://tenor.googleapis.com/v2/search?q=${e.target.value}&key=${TENOR_KEY}&limit=6`);
    const { results } = await res.json();
    document.getElementById('gif-results').innerHTML = results.map(g => 
        `<img src="${g.media_formats.tinygif.url}" onclick="sendGif('${g.media_formats.gif.url}')">`
    ).join('');
};

window.sendGif = async (url) => {
    await addDoc(collection(db, "messages"), {
        content: url, type: "gif", groupId: currentGroupId, uid: currentUser.uid, 
        photoURL: currentUser.photoURL, createdAt: serverTimestamp()
    });
    document.getElementById('gif-menu').classList.add('hidden');
};

// Groups
document.getElementById('create-group-btn').onclick = async () => {
    const name = prompt("Group Name:");
    if(name) await addDoc(collection(db, "groups"), { name, members: [currentUser.uid], owner: currentUser.uid });
};

function loadGroups() {
    const q = query(collection(db, "groups"), where("members", "array-contains", currentUser.uid));
    onSnapshot(q, (snap) => {
        const list = document.getElementById('group-list');
        list.innerHTML = '';
        snap.forEach(doc => {
            const g = doc.data();
            const div = document.createElement('div');
            div.className = 'server-icon';
            div.innerText = g.name[0].toUpperCase();
            div.onclick = () => switchChat(doc.id, g.name);
            list.appendChild(div);
        });
    });
}