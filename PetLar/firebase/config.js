// firebase/config.js
import { initializeApp } from 'firebase/app'      ;
import { getAuth       } from 'firebase/auth'     ;
import { getFirestore  } from 'firebase/firestore';

// Configurações do Firebase
const firebaseConfig = {
  apiKey           : "AIzaSyD7ZJmTRut0Tvt3xsuGjhX2b8-MdKM3QtM"  ,
  authDomain       : "petlar-26711.firebaseapp.com"             ,
  projectId        : "petlar-26711"                             ,
  storageBucket    : "petlar-26711.firebasestorage.app"         ,
  messagingSenderId: "405293208806"                             ,
  appId            : "1:405293208806:web:0b1afaef7395c517161727",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Authentication e obtém uma referência ao serviço
export const auth = getAuth(app);

// Inicializa o Cloud Firestore e obtém uma referência ao serviço
export const db = getFirestore(app);

export default app;
