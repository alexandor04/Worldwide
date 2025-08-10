// --- Configuration Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyCA69QC7iN3PfhIHn06O0xpsDMytBVnPNc",
    authDomain: "citations-livres.firebaseapp.com",
    databaseURL: "https://citations-livres-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "citations-livres",
    storageBucket: "citations-livres.firebasestorage.app",
    messagingSenderId: "351166565268",
    appId: "1:351166565268:web:e7f694146cca0eec279d81"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

auth.signInAnonymously()
    .then(() => console.log("✅ Connecté à Firebase"))
    .catch(error => console.error("❌ Erreur Firebase Auth :", error));

document.addEventListener('DOMContentLoaded', () => {

    // --- Sélecteurs ---
    const mainPage = document.getElementById('main-page');
    const quotePage = document.getElementById('quote-page');
    const books = document.querySelectorAll('.book');
    const backButton = document.getElementById('back-button');
    const quotePageTitle = document.getElementById('quote-page-title');
    const quotesList = document.getElementById('quotes-list');
    const showFormButton = document.getElementById('show-form-button');
    const quoteFormContainer = document.querySelector('.quote-form-container');
    const quoteForm = document.getElementById('quote-form');

    const characterForm = document.getElementById('character-form');
    const charactersList = document.getElementById('characters-list');

    // Bouton flottant personnages
    const showCharacterFormButton = document.getElementById('show-character-form-button');
    const characterFormContainer = document.querySelector('.character-form-container');

    let currentBookId = null;

    // --- Données locales ---
    const bookData = {
        canguilhem: { title: "La connaissance de la vie", quotes: [] },
        verne: { title: "Vingt mille lieues sous les mers", quotes: [] },
        haushofer: { title: "Le mur invisible", quotes: [] }
    };

    let charactersData = {
        canguilhem:
