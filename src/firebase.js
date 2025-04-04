import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, push, remove, update, get, child } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARmBE7raWh4dJGAbv1jrwJCntsxCRytjY",
    authDomain: "moengagetutorial.firebaseapp.com",
    databaseURL: "https://moengagetutorial-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "moengagetutorial",
    storageBucket: "moengagetutorial.firebasestorage.app",
    messagingSenderId: "51503879947",
    appId: "1:51503879947:web:5a485358a3f2d80ae0340e",
    measurementId: "G-VTJJCWJ4QJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Export all required functions
export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    ref,
    set,
    push,
    remove,
    update,
    get,
    child
};
