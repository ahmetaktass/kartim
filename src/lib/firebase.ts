import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA5WbZHmOrnanWXDPYXoa8ngzdHuu2OYII",
    authDomain: "kartim-4458e.firebaseapp.com",
    projectId: "kartim-4458e",
    storageBucket: "kartim-4458e.firebasestorage.app",
    messagingSenderId: "647811012300",
    appId: "1:647811012300:web:14cb8172b7492bb08b5469",
    measurementId: "G-1B9LZ4KJNX"
  }
// Firebase'i başlat
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 