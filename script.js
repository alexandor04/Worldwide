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
    // Sélecteurs
    const mainPage = document.getElementById('main-page');
    const quotePage = document.getElementById('quote-page');
    const characterPage = document.getElementById('character-page');
    const books = document.querySelectorAll('.book');
    const backButton = document.getElementById('back-button');
    const quotePageTitle = document.getElementById('quote-page-title');
    const characterPageTitle = document.getElementById('character-page-title');
    const quotesList = document.getElementById('quotes-list');
    const charactersList = document.getElementById('characters-list');
    const showFormButton = document.getElementById('show-form-button');
    const showCharacterFormButton = document.getElementById('show-character-form-button');
    const quoteFormContainer = document.querySelector('.quote-form-container');
    const characterFormContainer = document.querySelector('.character-form-container');
    const quoteForm = document.getElementById('quote-form');
    const characterForm = document.getElementById('character-form');

    let currentBookId = null;

    // Données locales
    const bookData = {
        canguilhem: { title: "La connaissance de la vie", quotes: [] },
        verne: { title: "Vingt mille lieues sous les mers", quotes: [] },
        haushofer: { title: "Le mur invisible", quotes: [] }
    };

    const charactersData = {
        canguilhem: { title: "La connaissance de la vie", characters: [] },
        verne: { title: "Vingt mille lieues sous les mers", characters: [] },
        haushofer: { title: "Le mur invisible", characters: [] }
    };

    // Sauvegarde / Chargement
    function loadQuotesFromStorage() {
        const savedQuotes = JSON.parse(localStorage.getItem('bookQuotes'));
        if (savedQuotes) {
            Object.keys(bookData).forEach(bookId => {
                bookData[bookId].quotes = savedQuotes[bookId]?.quotes || [];
            });
        }
    }

    function saveQuotesToStorage() {
        localStorage.setItem('bookQuotes', JSON.stringify(bookData));
    }

    function loadCharactersFromStorage() {
        const savedChars = JSON.parse(localStorage.getItem('bookCharacters'));
        if (savedChars) {
            Object.keys(charactersData).forEach(bookId => {
                charactersData[bookId].characters = savedChars[bookId]?.characters || [];
            });
        }
    }

    function saveCharacters() {
        localStorage.setItem('bookCharacters', JSON.stringify(charactersData));
    }

    // Affichage citations
    function displayQuote(quoteObject, index) {
        const card = document.createElement('div');
        card.classList.add('quote-card');
        if (quoteObject.pinned) card.classList.add('pinned');

        const buttonBar = document.createElement('div');
        buttonBar.classList.add('quote-buttons');

        const pinBtn = document.createElement('button');
        pinBtn.classList.add('pin-button');
        pinBtn.innerHTML = quoteObject.pinned ? '📌' : '📍';
        if (quoteObject.pinned) pinBtn.classList.add('pinned');
        pinBtn.onclick = () => togglePin(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => deleteQuote(index);

        buttonBar.appendChild(pinBtn);
        buttonBar.appendChild(deleteBtn);
        card.appendChild(buttonBar);

        const content = document.createElement('p');
        content.classList.add('quote-content');
        content.textContent = quoteObject.text;
        card.appendChild(content);

        if (quoteObject.comment) {
            const comment = document.createElement('p');
            comment.classList.add('quote-comment');
            comment.textContent = quoteObject.comment;
            card.appendChild(comment);
        }

        const info = document.createElement('p');
        info.classList.add('quote-info');
        info.textContent = `Chapitre : ${quoteObject.chapter || 'N/A'} - Page : ${quoteObject.pageNumber || 'N/A'}`;
        card.appendChild(info);

        quotesList.appendChild(card);
    }

    // Affichage personnages
    function displayCharacters() {
        charactersList.innerHTML = '';
        if (!charactersData[currentBookId]) {
            charactersData[currentBookId] = { title: "", characters: [] };
        }
        charactersData[currentBookId].characters.forEach((char, index) => {
            const card = document.createElement('div');
            card.classList.add('character-card');
            card.innerHTML = `
                <strong>${char.name}</strong><br>
                Rôle : ${char.role || '—'}<br>
                Lien avec principal : ${char.linkMain || '—'}<br>
                Lien avec autre : ${char.linkOther || '—'}<br>
                <em>Citations :</em> ${char.quotes || '—'}<br>
                <button onclick="deleteCharacter(${index})">Supprimer</button>
            `;
            charactersList.appendChild(card);
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => deleteCharacter(index);
    }

    // Page citations + persos
    function showQuotePageFor(bookId) {
        currentBookId = bookId;
        const book = bookData[bookId];

        quotePageTitle.textContent = book.title;

        // Citations
        quotesList.innerHTML = '';
        if (book.quotes.length > 0) {
            book.quotes.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                const pageA = parseInt(a.pageNumber) || 0;
                const pageB = parseInt(b.pageNumber) || 0;
                return pageA - pageB;
            });
            book.quotes.forEach((quote, index) => displayQuote(quote, index));
        } else {
            quotesList.innerHTML = '<p style="text-align: center; color: #6c757d;">Aucune citation pour le moment.</p>';
        }

        // Personnages
        displayCharacters();
        characterPage.classList.remove('hidden');

        mainPage.classList.add('hidden');
        quotePage.classList.remove('hidden');
    }

    // Gestion citations
    function handleAddQuote(event) {
        event.preventDefault();

        const newQuote = {
            text: document.getElementById('quote-text').value.trim(),
            chapter: document.getElementById('quote-chapter').value.trim(),
            pageNumber: document.getElementById('quote-page-number').value.trim(),
            comment: document.getElementById('quote-comment').value.trim(),
            pinned: false,
            id: Date.now().toString()
        };

        if (!newQuote.text) return;

        bookData[currentBookId].quotes.push(newQuote);
        saveQuotesToStorage();
        showQuotePageFor(currentBookId);
        quoteForm.reset();
        quoteFormContainer.classList.add('hidden');

        const user = firebase.auth().currentUser;
        if (user) {
            const path = `citations/${user.uid}/${currentBookId}/${newQuote.id}`;
            firebase.database().ref(path).set(newQuote)
                .then(() => console.log("✅ Citation enregistrée"))
                .catch(error => console.error("❌ Erreur Firebase :", error));
        }
    }

     function deleteQuote(index) {
        if (confirm("Supprimer cette citation ?")) {
            const quoteToDelete = bookData[currentBookId].quotes[index];
            bookData[currentBookId].quotes.splice(index, 1);
            saveQuotesToStorage();
            showQuotePageFor(currentBookId);

            const user = firebase.auth().currentUser;
            if (user && quoteToDelete.id) {
                const path = `citations/${user.uid}/${currentBookId}/${quoteToDelete.id}`;
                firebase.database().ref(path).remove()
                    .then(() => console.log("🗑️ Citation supprimée"))
                    .catch(error => console.error("❌ Erreur suppression :", error));
            }
        }
    }

    function togglePin(index) {
        const quote = bookData[currentBookId].quotes[index];
        quote.pinned = !quote.pinned;
        saveQuotesToStorage();
        showQuotePageFor(currentBookId);
    }

    // Gestion personnages
    function handleAddCharacter(event) {
        event.preventDefault();

        const newCharacter = {
            name: document.getElementById('char-name').value.trim(),
            role: document.getElementById('char-role').value.trim(),
            linkMain: document.getElementById('char-link-main').value.trim(),
            linkOther: document.getElementById('char-link-other').value.trim(),
            quotes: document.getElementById('char-quotes').value.trim()
        };

        if (!newCharacter.name) return;

        charactersData[currentBookId].characters.push(newCharacter);
        saveCharacters();
        displayCharacters();
        characterForm.reset();
        characterFormContainer.classList.add('hidden');
    }

    function deleteCharacter(index) {
        if (confirm("Supprimer ce personnage ?")) {
            charactersData[currentBookId].characters.splice(index, 1);
            saveCharacters();
            displayCharacters();
        }
    }

    // Événements
    books.forEach(book => {
        book.addEventListener('click', () => {
            showQuotePageFor(book.id);
        });
    });

    backButton.addEventListener('click', () => {
        quotePage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        currentBookId = null;
    });

    showFormButton.addEventListener('click', () => {
        quoteFormContainer.classList.toggle('hidden');
    });

    quoteForm.addEventListener('submit', handleAddQuote);

    showCharacterFormButton.addEventListener('click', () => {
        characterFormContainer.classList.toggle('hidden');
    });

    characterForm.addEventListener('submit', handleAddCharacter);

    // Initialisation
    loadQuotesFromStorage();
    loadCharactersFromStorage();
});
