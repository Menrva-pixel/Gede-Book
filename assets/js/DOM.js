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