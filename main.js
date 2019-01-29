window.onload = function () {
	
	// Form
	const bookForm   = document.querySelector('.form');
	const bookAuthor = document.querySelector('.book-author');
	const bookTitle  = document.querySelector('.book-title');
	const bookYear   = document.querySelector('.book-year');
	const bookPages  = document.querySelector('.book-pages');
	const bookAdd    = document.querySelector('.btn-primary');
	const bookList   = document.querySelector('.list-group');
	let current    = document.getElementById('current').value;

	// Array of books from the localStorage if it is not empty
	let booksArray = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];

	// Add book in Book list
	const addBook = (bookInfo) => {
		// Create list-item
		const li     = document.createElement('li');
		li.className = 'list-group-item';
		li.id        = `${bookInfo.id}`;

		// Create wrapper for control buttons
		const btnWrap     = document.createElement('div');
		btnWrap.className = 'list-group-item__col col pl-0';

		// Create list-item content from bookInfo typed in form
		const liContent = (bookInfo) => {
			for (let param in bookInfo) {
				if (param === 'id') {
					continue;
				}
				if (bookInfo.hasOwnProperty(param)) {
					// Wrap every book data in span
					let bookParam       = document.createElement('span');
					bookParam.className = `${param}`;
					bookParam.innerHTML = `${bookInfo[param]}`;
					li.appendChild(bookParam);
				}
			}
		};
		
		// Control buttons config
		const liBtnsOpt = {
			edit : {
				classList : 'btn btn-sm btn-info',
				text      : 'Редактировать'
			},
			remove : {
				classList : 'btn btn-sm btn-dark ml-2',
				text      : 'Удалить'
			} 
		};

		// Create Control buttons
		const editBtn         = document.createElement('button');
		editBtn.className     = `${liBtnsOpt.edit.classList}`;
		editBtn.textContent   = `${liBtnsOpt.edit.text}`;
		editBtn.setAttribute('data-edit-id', li.id);

		const removeBtn       = document.createElement('button');
		removeBtn.className   = `${liBtnsOpt.remove.classList}`;
		removeBtn.textContent = `${liBtnsOpt.remove.text}`;
		removeBtn.setAttribute('data-remove-id', li.id);
		
		editBtn.onclick = function () {
			EditBook(this.dataset.editId);
		}

		removeBtn.onclick = function() {
			RemoveBook(this.dataset.removeId);
		};

		/*
			Actually I don't know exactly the best way to render elements
			Maybe using of template strings is...

			const btns = `
				<div class="${btnWrap.classes}">
					<button class="${btnEdit.classes}">${btnEdit.name}</button>
					<button class="${btnRemove.classes}">${btnRemove.name}</button>
				</div>
			`;

			And append them this way: bookList.innerHTML += btns;
		*/

		// Create li -> fill with content -> add to the list
		liContent(bookInfo);
		btnWrap.appendChild(editBtn);
		btnWrap.appendChild(removeBtn);
		li.appendChild(btnWrap);
		bookList.appendChild(li);
	}

	// Find book index in books array
	function FindBook(id) {
		let bookIndex;

		booksArray.forEach((book, index) => {
			if (book.id === id) {
				bookIndex = index;
			}
		});

		return bookIndex;
	}

	// Get book info from form
	function CollectBookInfo() {
		const book = {
			author : `${bookAuthor.value} `,
			title  : `${bookTitle.value} `,
			year   : `${bookYear.value}`,
			pages  : `${bookPages.value}`
		};
		return book;
	}

	// Fill form for editing with data from the list 
	// id - id of the list-item
	// index - index of the book in booksArray
	function FillForm(index) {
		const book = booksArray[index];

		for (const key in book) {
			if (book.hasOwnProperty(key)) {
				const input = bookForm.querySelector(`input[name="${key}"]`);
				if (input) {
					input.value = book[key];
				}
			}
		}

	}

	function UpdateLi(bookInfo, id) {
		const li = document.getElementById(id);

		for (const key in bookInfo) {
			if (bookInfo.hasOwnProperty(key)) {
				const span = li.querySelector(`span.${key}`);
				if (span) {
					span.textContent = bookInfo[key];
				}
			}
		}
	}

	// Delete book
	function RemoveBook(id) {
		const index = FindBook(id);

		bookForm.reset();
		booksArray.splice(index, 1);
		localStorage.setItem('books', JSON.stringify(booksArray));
		document.getElementById(id).remove();
	}

	// Edit book info
	function EditBook(id) {
		const index = FindBook(id);
		
		bookForm.reset();
		FillForm(index);
		current = id;
		bookAdd.classList.add('btn-success');
	}

	function SaveChanges(id) {
		const index = FindBook(id);
		const newBookInfo = CollectBookInfo();
		
		newBookInfo.id = id;
		UpdateLi(newBookInfo, id);
		booksArray[index] = newBookInfo;

		// Save changes
		localStorage.setItem('books', JSON.stringify(booksArray));
		bookForm.reset();
		bookAdd.classList.remove('btn-success');

	}

	bookForm.addEventListener('submit', function (e) {
		e.preventDefault();

		// If the editBtn was pressed
		// New book info would be save
		if (bookAdd.classList.contains('btn-success')) {
			SaveChanges(current);
			return;
		}

		const book = CollectBookInfo();

		// Settin new book id
		// no books
		if (booksArray.length === 0) {
			book.id = 'book_0';
		} else {
			// get last book's id in array
			const reg  = /\D/g;
			let lastID = booksArray[booksArray.length-1].id;
			let newID  = '';

			lastID = Number(lastID.replace(reg, ''));
			newID = `book_${lastID + 1}`;
			book.id = newID;

		}

		// Add book to the all books array
		booksArray.push(book);
		// Storage all books
		localStorage.setItem('books', JSON.stringify(booksArray));
		// Add book to the list
		addBook(book);
		// Clear form
		bookForm.reset();

	});

	// Display stored books
	if (localStorage.getItem('books')) {
		booksArray = JSON.parse(localStorage.getItem('books'));
		booksArray.forEach(book => {
			addBook(book);
		});
	}
};