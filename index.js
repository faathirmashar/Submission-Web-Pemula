// Input Data
const inputTitle = document.querySelector('#input-title');
const inputAuthor = document.querySelector('#input-author');
const inputYear = document.querySelector('#input-year');
const checkboxFinishedBook = document.querySelector('#checkbox-finished-book');

// Button Input Data
const btnInputFinishedBook = document.querySelector('.btn-input-finished');
const btnInputNotFinishedBook = document.querySelector('.btn-input-not-finished');

// Container Data
const containerBooks = document.querySelector('#container-books');

// Navigation Data
const navNotFinished = document.querySelector('.nav-not-finished');
const navFinished = document.querySelector('.nav-finished');

// Search Data
const inputSearch = document.querySelector('#input-search');
const btnSearch = document.querySelector('.btn-search');

// Modal
const btnAcceptDelete = document.querySelector('#btn-accept-delete');

const books_entity = "BOOKS";
let books = getBooks();

function getBooks() {
    return JSON.parse(localStorage.getItem(books_entity)) || [];
}

function showBooks(tab) {
    containerBooks.innerHTML = "";

    books.forEach(book => {
        if (book.isComplete && tab === 'FINISHED') {
            const row = document.createElement('div');
            row.classList.add('card','p-3','mb-2');
            row.innerHTML = `
                <h2>${book.title}</h2>
                <p>Penulis: ${book.author}</p>
                <p>Tahun : ${book.year}</p>
            `;

            const btnNotFinished = document.createElement('button');
            btnNotFinished.classList.add('btn', 'btn-success', 'mb-2');
            btnNotFinished.innerHTML = 'Belum selesai dibaca';
            btnNotFinished.addEventListener('click', function(e) {
                deleteData(book.id, tab);
                addBook(getBookJsonObject(book.title, book.author, book.year, false), 'FINISHED');
            });

            const btnDeleteFinished = document.createElement('button');
            btnDeleteFinished.classList.add('btn', 'btn-danger', 'btn-delete-finished');
            btnDeleteFinished.setAttribute("data-bs-toggle","modal");
            btnDeleteFinished.setAttribute("data-bs-target","#book-modal");
            btnDeleteFinished.innerHTML = 'Hapus buku';
            btnDeleteFinished.addEventListener('click', function(e) {
                btnAcceptDelete.addEventListener('click', function(e) {
                    deleteData(book.id, tab);
                });
            });

            row.appendChild(btnNotFinished);
            row.appendChild(btnDeleteFinished);
            containerBooks.appendChild(row);
        } else if(!book.isComplete && tab === 'NOT_FINISHED') {
            const row = document.createElement('div');
            row.classList.add('card','p-3','mb-2');
            row.innerHTML = `
                <h2>${book.title}</h2>
                <p>Penulis: ${book.author}</p>
                <p>Tahun : ${book.year}</p>
            `;

            const btnHasFinished = document.createElement('button');
            btnHasFinished.classList.add('btn', 'btn-success', 'btn-has-finished', 'mb-2');
            btnHasFinished.innerHTML = 'Selesai dibaca';
            btnHasFinished.addEventListener('click', function(e) {
                deleteData(book.id, tab);
                addBook(getBookJsonObject(book.title, book.author, book.year, true), "NOT_FINISHED");
            });

            const btnDeleteNotFinished = document.createElement('button');
            btnDeleteNotFinished.classList.add('btn', 'btn-danger', 'btn-delete-not-finished');
            btnDeleteNotFinished.setAttribute("data-bs-toggle","modal");
            btnDeleteNotFinished.setAttribute("data-bs-target","#book-modal");
            btnDeleteNotFinished.innerHTML = 'Hapus buku';
            btnDeleteNotFinished.addEventListener('click', function(e) {
                btnAcceptDelete.addEventListener('click', function(e) {
                    deleteData(book.id, tab);
                });
            });

            row.appendChild(btnHasFinished);
            row.appendChild(btnDeleteNotFinished);
            containerBooks.appendChild(row);
        }
    })
}

showBooks('NOT_FINISHED');

function deleteData(id, tab) {
    const data = getBooks();
    const filteredData = data.filter(function(e) {
        if (e.id != id) {
            return e;
        }
    });

    localStorage.setItem(books_entity, JSON.stringify(filteredData));
    books = getBooks();
    showBooks(tab);
}

function addBook(book, tab) {
    let data = [];
    if (getBooks().length == 0) {
        data = [];
    } else {
        data = getBooks();
    }     

    data.unshift(book);

    localStorage.setItem(books_entity, JSON.stringify(data));
    books = getBooks();
    showBooks(tab);
}

function getBookJsonObject(title, author, year, isComplete) {
    const book = {
        id: new Date().getMilliseconds(),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };

    return book;
}

function searchData(query) {
    if (query) {
        books = getBooks().filter(function(e) {
            if(e.title.toLowerCase().includes(query)) {
                return e;
            } else {
                return;
            }
        });
    } else {
        books = getBooks();
    }
}

btnSearch.addEventListener('click', function(e) {
    e.preventDefault();
    searchData(inputSearch.value);
    showNavUnfinished();
});

btnInputFinishedBook.addEventListener('click', function(e) {
    e.preventDefault();
    addBook(getBookJsonObject(inputTitle.value, inputAuthor.value, inputYear.value, true), "FINISHED");
    books = getBooks();
    showNavFinished();
});

btnInputNotFinishedBook.addEventListener('click', function(e) {
    e.preventDefault();
    addBook(getBookJsonObject(inputTitle.value, inputAuthor.value, inputYear.value, false), "NOT_FINISHED");
    books = getBooks();
    showNavUnfinished();
});

navNotFinished.addEventListener('click', function(e) {
    showNavUnfinished();
});

function showNavUnfinished() {
    navNotFinished.classList.add('active');
    navFinished.classList.remove('active');

    showBooks('NOT_FINISHED');
}

navFinished.addEventListener('click', function(e) {
    showNavFinished();
});

function showNavFinished() {
    navFinished.classList.add('active');
    navNotFinished.classList.remove('active');

    showBooks('FINISHED');
}

checkboxFinishedBook.addEventListener('click', function(e) {
    if (checkboxFinishedBook.checked) {
        btnInputNotFinishedBook.classList.add('d-none');
        btnInputNotFinishedBook.classList.remove('d-inline-block');
        btnInputFinishedBook.classList.add('d-inline-block');
        btnInputFinishedBook.classList.remove('d-none');

        showNavFinished();
    } else {
        btnInputFinishedBook.classList.add('d-none');
        btnInputFinishedBook.classList.remove('d-inline-block');
        btnInputNotFinishedBook.classList.add('d-inline-block');
        btnInputNotFinishedBook.classList.remove('d-none');

        showNavUnfinished();
    }
});