(() => {
    /*fungsi utama*/
    let books = [];


        // Load books from local storage on page load
        function loadBooks() {
            const storedBooks = JSON.parse(localStorage.getItem("books"));
            if (storedBooks) {
                books = storedBooks;
                displayBooks(books);
            }
        }
    
        // Save books to local storage
        function saveBooks() {
            localStorage.setItem("books", JSON.stringify(books));
        }
    /*----------------------------------------------untuk menambahkan buku--------------------------------------------------------------*/
    function tambahBuku(event) {
        event.preventDefault();
        const titleInput = document.querySelector("#inputBookTitle").value;
        const authorInput = document.querySelector("#inputBookAuthor").value;
        const yearInput = document.querySelector("#inputBookYear").value;
        const isCompleteInput = document.querySelector("#inputBookIsComplete").value;
            document.dispatchEvent(new Event("bookChanged"));
            showDialog("Buku berhasil ditambahkan ke rak.");

        const book = {
            id: +new Date(),
            title: titleInput,
            author: authorInput,
            year: yearInput,
            isComplete: isCompleteInput,
        };
        console.log(book);

        books.push(book);
        document.dispatchEvent(new Event("bookChanged"));

    }
    /*----------------------------------------------untuk mencari buku--------------------------------------------------------------*/
    function searchBook(event) {
        event.preventDefault();
        const searchInput = document.querySelector("#searchBookTitle");
        const query = searchInput.value;

        if (query) {
            displayBooks(books.filter(book => book.title.toLowerCase().includes(query.toLowerCase())));
        } else {
            displayBooks(books);
        }
    }
    /*----------------------------------------------jika buku sudah dibaca--------------------------------------------------------------*/
    function sudahDiBaca(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex] = {
                ...books[bookIndex],
                isComplete: true
            };

            document.dispatchEvent(new Event("bookChanged"));
        }
    }
    /*----------------------------------------------jika buku belum dibaca--------------------------------------------------------------*/
    function belumDiBaca(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex] = {
                ...books[bookIndex],
                isComplete: false
            };

            document.dispatchEvent(new Event("bookChanged"));
        }
    }
    /*----------------------------------------------hapus buku--------------------------------------------------------------*/

    function hapusBuku(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);
    
            if (bookIndex !== -1) {
                const bookTitle = books[bookIndex].title;
                const confirmation = confirm(`Hapus buku dari rak? ${bookTitle}?`);

            if (confirmation) {
                books.splice(bookIndex, 1);
                document.dispatchEvent(new Event("bookChanged"));
                alert(`Buku ${bookTitle} berhasil dihapus.`);
            }
         }      
    }
    /*----------------------------------------------RAK BUKU--------------------------------------------------------------*/



    function displayBooks(books) {
        const incompleteBookshelf = document.querySelector("#incompleteBookshelfList");
        const completeBookshelf = document.querySelector("#completeBookshelfList");

        incompleteBookshelf.innerHTML = "";
        completeBookshelf.innerHTML = "";

        for (const book of books) {
            const bookElement = document.createElement("article");
            bookElement.classList.add("book_item");

            const titleElement = document.createElement("h2");
            titleElement.innerText = book.title;

            const authorElement = document.createElement("p");
            authorElement.innerText = "Penulis: " + book.author;

            const yearElement = document.createElement("p");
            yearElement.innerText = "Tahun: " + book.year;

            bookElement.appendChild(titleElement);
            bookElement.appendChild(authorElement);
            bookElement.appendChild(yearElement);

            if (book.isComplete) {
                const actionContainer = document.createElement("div");
                actionContainer.classList.add("action");

                const incompleteButton = document.createElement("button");
                incompleteButton.id = book.id;
                incompleteButton.innerText = "Belum Selesai dibaca";
                incompleteButton.classList.add("green");
                incompleteButton.addEventListener("click", belumDiBaca);

                const deleteButton = document.createElement("button");
                deleteButton.id = book.id;
                deleteButton.innerText = "Hapus buku";
                deleteButton.classList.add("red");
                deleteButton.addEventListener("click", hapusBuku);

                actionContainer.appendChild(incompleteButton);
                actionContainer.appendChild(deleteButton);

                bookElement.appendChild(actionContainer);
                completeBookshelf.appendChild(bookElement);
            } else {
                const
                actionContainer = document.createElement("div");
                actionContainer.classList.add("action");

                const completeButton = document.createElement("button");
                completeButton.id = book.id;
                completeButton.innerText = "Selesai dibaca";
                completeButton.classList.add("green");
                completeButton.addEventListener("click", sudahDiBaca);
    
                const deleteButton = document.createElement("button");
                deleteButton.id = book.id;
                deleteButton.innerText = "Hapus buku";
                deleteButton.classList.add("red");
                deleteButton.addEventListener("click", hapusBuku);
    
                actionContainer.appendChild(completeButton);
                actionContainer.appendChild(deleteButton);
    
                bookElement.appendChild(actionContainer);
                incompleteBookshelf.appendChild(bookElement);
            }
        }
    }

    function showDialog(message) {
        const dialog = document.createElement("div");
        dialog.classList.add("dialog");
        
        const messageElement = document.createElement("p");
        messageElement.innerText = message;
        
        const closeButton = document.createElement("button");
        closeButton.innerText = "Tutup";
        closeButton.addEventListener("click", function() {
          dialog.remove();
        });
        
        dialog.appendChild(messageElement);
        dialog.appendChild(closeButton);
        
        document.body.appendChild(dialog);
      }
    
    document.addEventListener("DOMContentLoaded", function() {
        const submitForm = document.querySelector("#inputBook");
        submitForm.addEventListener("submit", tambahBuku);
    
        const searchForm = document.querySelector("#searchBook");
        searchForm.addEventListener("submit", searchBook);
    
        document.addEventListener("bookChanged", function() {
            displayBooks(books);
        });
    });

})();