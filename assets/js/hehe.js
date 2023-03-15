let books = [];
const STORAGE_KEY = "BOOK_APPS";
const BOOK_ITEMID = "itemId";
const RENDER_EVENT = "render";


// AddBooks when user clicks on the button
document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBooks();
      submitForm.reset();
    });
  
    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      searchBooks();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
      console.log(books);
    }
  });

  // Render function
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById(
      "incompleteBookshelfList"
    );
    uncompletedBookList.innerHTML = "";
  
    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";
  
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      bookElement[BOOK_ITEMID] = bookItem.id;
  
      if (bookItem.isComplete) {
        completedBookList.append(bookElement);
      } else {
        uncompletedBookList.append(bookElement);
      }
    }
  });


/*-----------------Tambah Buku-----------------*/
function makeBook(book) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = book.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = book.year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const bookContainer = document.createElement("article");
  bookContainer.setAttribute("id", book.id);
  bookContainer.classList.add("book_item");
  bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  if (book.isComplete) {
    buttonContainer.append(createUndoButton(), createTrashButton());
  } else {
    buttonContainer.append(createCheckButton(), createTrashButton());
  }

  return bookContainer;
}

/*----------------------Detail Buku------------------*/
function addBooks() {
  const textBook = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();

  const bookObject = generateBookObject(
    generatedID,
    textBook,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

/*----id generator untuk buku-----*/
function generateId() {
  return +new Date();
}

/*----simpan data buku ke local storage----*/
function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

/*-------checkbox jika buku sudah dibaca--------*/
function createCheckButton() {
  const button = document.createElement("button");
  button.classList.add("green");
  const icon = document.createElement("img");
  icon.setAttribute("src", "assets/img/add.png"); // replace with path to your image
  icon.setAttribute("alt", "Sudah Dibaca");
  button.appendChild(icon);
  button.addEventListener("click", function(event) {
    addBookToCompleted(event.target.parentElement.parentElement);
    const searchForm = document.getElementById("searchBook");
    searchForm.reset();
  });
  return button;
}

function createUndoButton() {
  return createButton(
    "green",
    function (event) {
      undoBookFromCompleted(event.target.parentElement.parentElement);
      const searchForm = document.getElementById("searchBook");
      searchForm.reset();
    },
    "Belum di baca"
  );
}

// CreateTrashButton function
function createTrashButton() {
  return createButton(
    "red",
    function (event) {
      removeBookFromCompleted(event.target.parentElement.parentElement);
      const searchForm = document.getElementById("searchBook");
      searchForm.reset();
    },
    "trash"
  );
}

// CreateButton function
function createButton(buttonTypeClass, eventListener, text) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = text;
  button.addEventListener("click", function (event) {
    eventListener(event);
    event.stopPropagation();
  });
  return button;
}

// AddBookToCompleted function
function addBookToCompleted(bookElement) {
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = true;
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// UndoBookFromCompleted function
function undoBookFromCompleted(bookElement) {
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = false;
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// RemoveBookFromCompleted function
function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement);
  books.splice(bookPosition, 1);
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// FindBook function
function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

// FindBookIndex function
function findBookIndex(bookId) {
  let index = 0;
  for (const book of books) {
    if (book.id === bookId) {
      return index;
    }
    index++;
  }
  return -1;
}



// LoadDataFromStorage function
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// IsStorageExist function
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// Search Books Function
function searchBooks() {
  const searchTitle = document.getElementById("searchBookTitle").value;

  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  if (searchTitle === "") {
    uncompletedBookList.innerHTML = "";
    completedBookList.innerHTML = "";
    books = [];
    console.log(books);
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  } else {
    const filteredBooks = books.filter((book) => {
      return book.title.toLowerCase().includes(searchTitle.toLowerCase());
    });
    console.log(filteredBooks);
    for (const bookItem of filteredBooks) {
      const bookElement = makeBook(bookItem);
      bookElement[BOOK_ITEMID] = bookItem.id;
      if (bookItem.isComplete) {
        completedBookList.append(bookElement);
      } else {
        uncompletedBookList.append(bookElement);
      }
    }
  }
}
