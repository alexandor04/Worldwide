firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Connexion anonyme sécurisé
auth.signInAnonymously()
  .then(() => {
    console.log("Connecté à Firebase (anonyme)");
  })
  .catch((error) => {
    console.error("Erreur d'auth anonyme :", error);
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
            pinned: false
        };

        if (!newQuote.text) return;

        bookData[currentBookId].quotes.push(newQuote);
        saveQuotesToStorage();
        envoyerCitationAuServeur(newQuote, bookData[currentBookId].title);
        showQuotePageFor(currentBookId);
        quoteForm.reset();
        quoteFormContainer.classList.add('hidden');
    }

    function deleteQuote(index) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette citation ?")) {
            bookData[currentBookId].quotes.splice(index, 1);
            saveQuotesToStorage();
            showQuotePageFor(currentBookId);
        }
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
