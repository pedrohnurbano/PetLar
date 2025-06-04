// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Suas configurações do Firebase (substitua pelos seus dados do Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyD7ZJmTRut0Tvt3xsuGjhX2b8-MdKM3QtM",
  authDomain: "petlar-26711.firebaseapp.com",
  projectId: "petlar-26711",
  storageBucket: "petlar-26711.firebasestorage.app",
  messagingSenderId: "405293208806",
  appId: "1:405293208806:web:0b1afaef7395c517161727",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
