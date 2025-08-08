const firebaseConfig = {
  apiKey: "AIzaSyCA69QC7iN3PfhIHn06O0xpsDMytBVnPNc",
  authDomain: "citations-livres.firebaseapp.com",
  databaseURL: "https://citations-livres-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "citations-livres",
  storageBucket: "citations-livres.firebasestorage.app",
  messagingSenderId: "351166565268",
  appId: "1:351166565268:web:e7f694146cca0eec279d81"
};

// 🚀 Initialisation de Firebas
firebase.initializeApp(firebaseConfig);

// 🔗 Connexion à la base de données et a
const db = firebase.database();
const auth = firebase.auth();

// Connexion anonyme (si tu utilises ce mode)
auth.signInAnonymously()
  .then(() => {
    console.log("Connecté à Firebase");
  })
  .catch((error) => {
    console.error("Erreur Firebase Auth :", error);
  });

document.addEventListener('DOMContentLoaded', () => {

    const mainPage = document.getElementById('main-page');
    const quotePage = document.getElementById('quote-page');
    const books = document.querySelectorAll('.book');
    const backButton = document.getElementById('back-button');
    const quotePageTitle = document.getElementById('quote-page-title');
    const quotesList = document.getElementById('quotes-list');
    const showFormButton = document.getElementById('show-form-button');
    const quoteFormContainer = document.querySelector('.quote-form-container');
    const quoteForm = document.getElementById('quote-form');

    let currentBookId = null;

    const bookData = {
        canguilhem: { title: "La connaissance de la vie", quotes: [] },
        verne: { title: "Vingt mille lieues sous les mers", quotes: [] },
        haushofer: { title: "Le mur invisible", quotes: [] }
    };
  const showCharactersButton = document.getElementById('show-characters-button');
  const charactersPanel = document.getElementById('characters-panel');
  const characterForm = document.getElementById('character-form');
  const charactersList = document.getElementById('characters-list');

  let charactersData = [];

    function loadQuotesFromStorage() {
        const savedQuotes = JSON.parse(localStorage.getItem('bookQuotes'));
        if (savedQuotes) {
            bookData.canguilhem.quotes = savedQuotes.canguilhem?.quotes || [];
            bookData.verne.quotes = savedQuotes.verne?.quotes || [];
            bookData.haushofer.quotes = savedQuotes.haushofer?.quotes || [];
        }
    }

    function saveQuotesToStorage() {
        localStorage.setItem('bookQuotes', JSON.stringify(bookData));
    }

    function displayQuote(quoteObject, index) {
        const card = document.createElement('div');
        card.classList.add('quote-card');
        if (quoteObject.pinned) {
            card.classList.add('pinned');
        }

        const buttonBar = document.createElement('div');
        buttonBar.classList.add('quote-buttons');

        const pinBtn = document.createElement('button');
        pinBtn.classList.add('pin-button');
        pinBtn.innerHTML = quoteObject.pinned ? '📌' : '📍';
        if (quoteObject.pinned) {
            pinBtn.classList.add('pinned');
        }
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

    function showQuotePageFor(bookId) {
        currentBookId = bookId;
        const book = bookData[bookId];

        quotePageTitle.textContent = book.title;
        quotesList.innerHTML = '';

        if (book.quotes.length > 0) {
            book.quotes.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                const pageA = parseInt(a.pageNumber) || 0;
                const pageB = parseInt(b.pageNumber) || 0;
                return pageA - pageB;
            });

            book.quotes.forEach((quote, index) => {
                displayQuote(quote, index);
            });
        } else {
            quotesList.innerHTML = '<p style="text-align: center; color: #6c757d;">Aucune citation pour le moment. Ajoutez-en une !</p>';
        }

        mainPage.classList.add('hidden');
        quotePage.classList.remove('hidden');
        quoteFormContainer.classList.add('hidden');
    }

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

    // Enregistrement en localStorage (comme avant)
    bookData[currentBookId].quotes.push(newQuote);
    saveQuotesToStorage();
    showQuotePageFor(currentBookId);
    quoteForm.reset();
    quoteFormContainer.classList.add('hidden');

    // 🔐 Enregistrement dans Firebase
    const user = firebase.auth().currentUser;

    if (user) {
        const path = `citations/${user.uid}/${currentBookId}/${newQuote.id}`;
        firebase.database().ref(path).set({
            text: newQuote.text,
            chapter: newQuote.chapter,
            pageNumber: newQuote.pageNumber,
            comment: newQuote.comment,
            pinned: newQuote.pinned
        })
        .then(() => console.log("✅ Citation enregistrée dans Firebase"))
        .catch(error => console.error("❌ Erreur Firebase :", error));
    } else {
        console.warn("Utilisateur non connecté à Firebase");
    }
}

 function deleteQuote(index) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette citation ?")) {
        const quoteToDelete = bookData[currentBookId].quotes[index];

        // Suppression locale
        bookData[currentBookId].quotes.splice(index, 1);
        saveQuotesToStorage();
        showQuotePageFor(currentBookId);

        // Suppression dans Firebase
        const user = firebase.auth().currentUser;

        if (user && quoteToDelete.id) {
            const path = `citations/${user.uid}/${currentBookId}/${quoteToDelete.id}`;
            firebase.database().ref(path).remove()
                .then(() => console.log("🗑️ Citation supprimée de Firebase"))
                .catch(error => console.error("❌ Erreur suppression Firebase :", error));
        } else {
            console.warn("Impossible de supprimer la citation sur Firebase : UID ou ID manquant.");
        }
    }
}

  // Afficher / cacher la colonne
showCharactersButton.addEventListener('click', () => {
    charactersPanel.classList.toggle('hidden');
});

// Ajouter un personnage
characterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCharacter = {
        name: document.getElementById('char-name').value.trim(),
        role: document.getElementById('char-role').value.trim(),
        linkMain: document.getElementById('char-link-main').value.trim(),
        linkOther: document.getElementById('char-link-other').value.trim(),
        quotes: document.getElementById('char-quotes').value.trim()
    };
    charactersData.push(newCharacter);
    displayCharacters();
    characterForm.reset();
});

// Afficher la liste
function displayCharacters() {
    charactersList.innerHTML = '';
    charactersData.forEach((char, index) => {
        const div = document.createElement('div');
        div.classList.add('character-card');
        div.innerHTML = `
            <strong>${char.name}</strong><br>
            Rôle : ${char.role}<br>
            Lien avec principal : ${char.linkMain}<br>
            Lien avec autre : ${char.linkOther}<br>
            <em>Citations :</em> ${char.quotes}
        `;
        charactersList.appendChild(div);
    });
}

  
    function togglePin(index) {
        const quote = bookData[currentBookId].quotes[index];
        quote.pinned = !quote.pinned;
        saveQuotesToStorage();
        showQuotePageFor(currentBookId);
    }

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

  // ==== Gestion des Personnages ====
const showCharacterFormButton = document.getElementById('show-character-form-button');
const characterPage = document.getElementById('character-page');

let charactersData = JSON.parse(localStorage.getItem('bookCharacters')) || [];

// Afficher / masquer panneau gauche
showCharacterFormButton.addEventListener('click', () => {
    characterPage.classList.toggle('hidden');
});

// Sauvegarder personnages
function saveCharacters() {
    localStorage.setItem('bookCharacters', JSON.stringify(charactersData));
}

// Afficher liste
function displayCharacters() {
    charactersList.innerHTML = '';
    charactersData.forEach((char, index) => {
        const card = document.createElement('div');
        card.classList.add('character-card');
        card.innerHTML = `
            <strong>${char.name}</strong><br>
            Rôle : ${char.role || '—'}<br>
            Lien avec principal : ${char.linkMain || '—'}<br>
            Lien avec autre : ${char.linkOther || '—'}<br>
            <em>Citations :</em> ${char.quotes || '—'}<br>
            <button onclick="deleteCharacter(${index})" style="margin-top:5px;background:#e63946;color:white;border:none;padding:4px 8px;border-radius:4px;">Supprimer</button>
        `;
        charactersList.appendChild(card);
    });
}

// Supprimer personnage
window.deleteCharacter = function(index) {
    charactersData.splice(index, 1);
    saveCharacters();
    displayCharacters();
};

// Ajout personnage
characterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCharacter = {
        name: document.getElementById('char-name').value.trim(),
        role: document.getElementById('char-role').value.trim(),
        linkMain: document.getElementById('char-link-main').value.trim(),
        linkOther: document.getElementById('char-link-other').value.trim(),
        quotes: document.getElementById('char-quotes').value.trim()
    };
    charactersData.push(newCharacter);
    saveCharacters();
    displayCharacters();
    characterForm.reset();
});

// Afficher au chargement
displayCharacters();


    loadQuotesFromStorage();
});
function envoyerCitationAuServeur(quote, bookTitle) {
    fetch('https://citations-server.onrender.com/ajouter-citation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            livre: bookTitle,
            citation: quote.text,
            chapitre: quote.chapter,
            page: quote.pageNumber,
            commentaire: quote.comment
        })
    })
    .then(res => res.text())
    .then(data => console.log('Serveur:', data))
    .catch(err => console.error('Erreur serveur:', err));
}
