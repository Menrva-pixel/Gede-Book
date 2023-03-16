

/*----- fungsi untuk menambahkan buku ketika tombol di tekan -----*/
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

  /*----- R E N D E R -----*/
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
/*------------POP UP setelah tombol di tekan---*/
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


/*-------pop up dialog untuk menampilkan konfirmasi penghapusan------*/
document.addEventListener(BOOK_REMOVED_EVENT, (event) => {
  const bookTitle = event.detail;
  const message = `Buku '${bookTitle}' telah dihapus dari rak.`;
  alert(message);
});

