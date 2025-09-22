// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js"

const firebaseConfig = {
  apiKey: "AIzaSyD2fWkU7tXZFxJ_YcursEAWyASN6DnQ1nw",
  authDomain: "acompanhamento-b1665.firebaseapp.com",
  projectId: "acompanhamento-b1665",
  storageBucket: "acompanhamento-b1665.firebasestorage.app",
  messagingSenderId: "393318150297",
  appId: "1:393318150297:web:89a62eae7454e60c37c808",
  measurementId: "G-KJTMF7JYV2",
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app)

// Exporta para o restante do projeto
export { app, auth, db, analytics }
