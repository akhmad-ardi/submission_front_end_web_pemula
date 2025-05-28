/* Data buku 
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

const formAddBook = document.getElementById('bookForm');
formAddBook.addEventListener('submit', (event) => {
  event.preventDefault();

  const titleInput = document.getElementById('bookFormTitle');
  const authorInput = document.getElementById('bookFormAuthor');
  const yearInput = document.getElementById('bookFormYear');
  const isCompleteCheckbox = document.getElementById('bookFormIsComplete');

  const title = titleInput.value;
  const author = authorInput.value;
  const year = Number(yearInput.value);
  const isComplete = isCompleteCheckbox.checked;

  const newBook = { id: Number(Date.now()), title, author, year, isComplete };

  const bookList = JSON.parse(localStorage.getItem('bookList'));
  bookList.push(newBook);

  localStorage.setItem('bookList', JSON.stringify(bookList));
  
  titleInput.value = '';
  authorInput.value = '';
  yearInput.value = '';
  isCompleteCheckbox.checked = false;

  alert('New book saved');

  const incompleteBookList = bookList.filter((b) => !b.isComplete);
  const completeBookList = bookList.filter((b) => b.isComplete);

  displayBook('incompleteBookList', incompleteBookList);
  displayBook('completeBookList', completeBookList);
});

const searchBook = document.getElementById('searchBook');
searchBook.addEventListener('submit', (event) => {
  event.preventDefault();

  const searchBookTitleInput = document.getElementById('searchBookTitle');
  const searchBookTitle = searchBookTitleInput.value;

  const bookList = JSON.parse(localStorage.getItem('bookList'));

  const fiterBookList = bookList.filter((book) => book.title.toLowerCase().includes(searchBookTitle.toLowerCase()));

  displayBook('incompleteBookList', fiterBookList.filter((b) => !b.isComplete));
  displayBook('completeBookList', fiterBookList.filter((b) => b.isComplete));
});

// Display books
function displayBook(idParentElement, bookList) {
  const bookListElement = document.getElementById(idParentElement);
  bookListElement.innerHTML = bookList.length === 0 ? `<h3 style="text-align: center;">Tidak ada buku</h3>` : '';
  
  bookList.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');
    bookItem.setAttribute('class', 'col');
  
    bookItem.innerHTML = `
      <div class="card card-body">
        <h3 class="card-title" data-testid="bookItemTitle">${book.title}</h3>
        <p class="card-subtitle mb-2 text-body-secondary" data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button class="btn btn-primary" data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai" : "Selesai"} dibaca</button>
          <button class="btn btn-danger" data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button class="btn btn-outline-primary" data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      </div>
    `;
    
    const completeButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');
    const editButton = bookItem.querySelector('[data-testid="bookItemEditButton"]');
    
    // Button complete book
    completeButton.addEventListener('click', (event) => {
      const bookList = JSON.parse(localStorage.getItem('bookList'));
      const bookDetail = bookList.find((b) => b.id === book.id);

      if (!bookDetail.isComplete) {
        if (confirm(`Apakah anda sudah selesai membaca buku yang berjudul ${book.title} oleh ${book.author}`)) {
          bookDetail.isComplete = true;
  
          localStorage.setItem('bookList', JSON.stringify(bookList));
        }
      } else {
        if (confirm(`Apakah anda belum selesai membaca buku yang berjudul ${book.title} oleh ${book.author}`)) {
          bookDetail.isComplete = false;
  
          localStorage.setItem('bookList', JSON.stringify(bookList));
        }
      }

      displayBook('incompleteBookList', bookList.filter((b) => !b.isComplete));
      displayBook('completeBookList', bookList.filter((b) => b.isComplete));
    });

    // Button delete book
    deleteButton.addEventListener('click', (event) => {
      const bookList = JSON.parse(localStorage.getItem('bookList'));

      if (confirm(`Apakah kamu ingin menghapus buku yang berjudul ${book.title} oleh ${book.author}`)) {
        const newBookList = bookList.filter((b) => b.id !== book.id);
  
        localStorage.setItem('bookList', JSON.stringify(newBookList));
        
        displayBook('incompleteBookList', newBookList.filter((b) => !b.isComplete));
        displayBook('completeBookList', newBookList.filter((b) => b.isComplete));
      }
    });

    // Button edit book
    editButton.addEventListener('click', (event) => {
      const bookList = JSON.parse(localStorage.getItem('bookList'));
      const bookDetail = bookList.find((b) => b.id === book.id);

      if (bookDetail) {
        const newTitle = prompt('New title');
        const newAuthor = prompt('New author');
        const newYear = prompt('New year');

        bookDetail.title = newTitle ? newTitle : bookDetail.title;
        bookDetail.author = newAuthor ? newAuthor : bookDetail.author;
        bookDetail.year = newYear ? Number(newYear) : Number(bookDetail.year);

        localStorage.setItem('bookList', JSON.stringify(bookList));

        displayBook('incompleteBookList', bookList.filter((b) => !b.isComplete));
        displayBook('completeBookList', bookList.filter((b) => b.isComplete));
      }
    });

    bookListElement.appendChild(bookItem);
  });
}

if (!localStorage.getItem('bookList')) {
  localStorage.setItem('bookList', '[]');
}

const bookList = JSON.parse(localStorage.getItem('bookList'));

displayBook('incompleteBookList', bookList.filter((b) => !b.isComplete));
displayBook('completeBookList', bookList.filter((b) => b.isComplete));

