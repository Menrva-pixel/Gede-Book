let books = [];
const STORAGE_KEY = "BOOK_APPS";
const BOOK_ITEMID = "itemId";
const RENDER_EVENT = "render";
const BOOK_REMOVED_EVENT = "bookRemoved";




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

  const popupDialog = document.createElement("div");
  popupDialog.innerHTML = "Buku berhasil ditambahkan!";
  popupDialog.classList.add("popup-dialog");
  document.body.appendChild(popupDialog);
  setTimeout(() => {
    document.body.removeChild(popupDialog);
  }, 2500);
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



/*-------tombol untuk memindahkan buku ke rak yang sudah di baca--------*/
function createCheckButton() {
  const button = document.createElement("button");
  button.classList.add("green");

  const iconContainer = document.createElement("span");
  iconContainer.innerHTML = '<svg width="25px" height="25px" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.01,9.01,0,0,1,12,21Zm5-9a1,1,0,0,1-1,1H13v3a1,1,0,0,1-2,0V13H8a1,1,0,0,1,0-2h3V8a1,1,0,0,1,2,0v3h3A1,1,0,0,1,17,12Z"></path></g></svg>';
  iconContainer.style.cursor = "pointer";

  button.addEventListener("click", function (event) {
    event.preventDefault();
    addBookToCompleted(event.target.closest(".book_item"));
    const searchForm = document.getElementById("searchBook");
    searchForm.reset();
  });

  button.appendChild(iconContainer);
  button.setAttribute("title", "Pindahkan ke rak buku yang telah di baca?");

  return button;
}
/*-------tombol untuk memindahkan buku ke rak yang belum di baca--------*/
function createUndoButton() {
  const button = document.createElement("button");
  button.classList.add("green");

  const iconContainer = document.createElement("span");
  iconContainer.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 12H8M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
  iconContainer.style.cursor = "pointer";

  button.addEventListener("click", function (event) {
    event.preventDefault();
    undoBookFromCompleted(event.target.closest(".book_item"));
    const searchForm = document.getElementById("searchBook");
    searchForm.reset();
  });

  button.appendChild(iconContainer);
  button.setAttribute("title", "Pindahkan ke rak buku yang belum di baca?");
  return button;
}
/*----------------------membuat tombol hapus--------------------------*/
function createTrashButton() {
  const button = document.createElement("button");
  button.classList.add("red");

  const iconContainer = document.createElement("span");
  iconContainer.innerHTML = '<svg width="25px" height="25px" fill="#ffffff" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" id="memory-trash" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10 7V16H8V7H10M12 7H14V16H12V7M8 2H14V3H19V5H18V19H17V20H5V19H4V5H3V3H8V2M6 5V18H16V5H6Z"></path></g></svg>';
  iconContainer.style.cursor = "pointer";

  button.addEventListener("click", function (event) {
    const parentElement = event.target.parentElement.parentElement;
    const bookTitle = parentElement.querySelector(".book_item > h3").innerText;

    const confirmed = confirm(`Anda yakin ingin menghapus buku '${bookTitle}' dari rak?`);
    if (confirmed) {
      removeBookFromCompleted(parentElement);
      document.dispatchEvent(new CustomEvent(BOOK_REMOVED_EVENT, {
        detail: bookTitle
      }));
      const searchForm = document.getElementById("searchBook");
      searchForm.reset();
    }
  });

  button.appendChild(iconContainer);
  button.setAttribute("title", "Hapus buku dari rak?");
  return button;
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

/*---fungsi pindah rak buku jika sudah dibaca ---*/
function addBookToCompleted(bookElement) {
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = true;
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/*---fungsi pindah rak buku jika belum dibaca ---*/
function undoBookFromCompleted(bookElement) {
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = false;
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/*---hapus buku dari rak---*/
function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement);
  books.splice(bookPosition, 1);
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/*---- Fungsi untuk mencari buku di rak -----*/
function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) { //mencari index book
  let index = 0;
  for (const book of books) {
    if (book.id === bookId) {
      return index;
    }
    index++;
  }
  return -1;
}



/*---fungsi untuk load data yang tersimpan di local storage---*/
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
    alert("Browser tidak mendukung local storage");
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