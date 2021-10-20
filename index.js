require("dotenv").config();
const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const Database = require("./database");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection established!"))
  .catch((err) => {
    console.log(err);
  });

const OurApp = express();

OurApp.use(express.json());

OurApp.get("/", (request, response) => {
  response.json({ message: "Request served!!!!" });
});

// Route    - /book
// Desc     - To get all book
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
OurApp.get("/book", (req, res) => {
  res.json({ book: Database.Book });
});

// Route    - /book/bookID
// Desc     - To get a book based on ISBN
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
OurApp.get("/book/:bookID", (req, res) => {
  const getBook = Database.Book.filter(
    (book) => book.ISBN === req.params.bookID
  );

  return res.json(getBook);
});

// Route    - /book/c/:category
// Desc     - to get a list of book based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
OurApp.get("/book/c/:category", (req, res) => {
  const getBook = Database.Book.filter((book) =>
    book.category.includes(req.params.category)
  );

  return res.json({ book: getBook });
});

// Route    - /book/a/:authorID
// Desc     - to get a list of book based on author
// Access   - Public
// Method   - GET
// Params   - authorID
// Body     - none
OurApp.get("/book/a/:authorID", (req, res) => {
  const getBook = Database.Book.filter((book) =>
    book.authors.includes(parseInt(req.params.authorID))
  );

  return res.json({ book: getBook });
});

// Route    - /author
// Desc     - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
OurApp.get("/author", (req, res) => {
  res.json({ Authors: Database.Author });
});

// Route    - /author/:authorID
// Desc     - to get specific author
// Access   - Public
// Method   - GET
// Params   - authorID
// Body     - none
OurApp.get("/author/:authorID", (req, res) => {
  const getAuthor = Database.Author.filter(
    (author) => author.id === parseInt(req.params.authorID)
  );
  res.json(getAuthor);
});

// Route    - /author/book/:isbn
// Desc     - to get list of author based on a book
// Access   - Public
// Method   - GET
// Params   - isbn
// Body     - none
OurApp.get("/author/book/:isbn", (req, res) => {
  const getAuthor = Database.Author.filter((author) =>
    author.book.includes(req.params.isbn)
  );
  res.json(getAuthor);
});

// Route    - /publications
// Desc     - to get all publication
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
OurApp.get("/publications", (req, res) => {
  res.json({ Publications: Database.Publication });
});

// Route    - /publications/:publicationID
// Desc     - to get specific publication
// Access   - Public
// Method   - GET
// Params   - publicationID
// Body     - none
OurApp.get("/publications/:publicationID", (req, res) => {
  const getPublication = Database.Publication.filter(
    (publication) => publication.id === parseInt(req.params.publicationID)
  );
  res.json({ publication: getPublication });
});

// Route    - /publications/book/:isbn
// Desc     - to get a list of publication based on a book.
// Access   - Public
// Method   - GET
// Params   - isbn
// Body     - none
OurApp.get("/publications/book/:isbn", (req, res) => {
  const getPublication = Database.Publication.filter((publication) =>
    publication.book.includes(req.params.isbn)
  );
  res.json(getPublication);
});

// Route    - /book/new
// Desc     - to add new book
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
OurApp.post("/book/new", (req, res) => {
  const { newBook } = req.body;
  Database.Book.push(newBook);
  return res.json(Database.Book);
});

// Route    - /author/new
// Desc     - to add new author
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
OurApp.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  Database.Author.push(newAuthor);
  return res.json(Database.Author);
});

// Route    - /publications/new
// Desc     - Add new publication
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
OurApp.post("/publications/new", (req, res) => {
  const { newPublication } = req.body;
  Database.Publication.push(newPublication);
  return res.json(Database.Publication);
});

// Route    - /book/update/:isbn
// Desc     - to update book details
// Access   - Public
// Method   - put
// Params   - isbn
// Body     - none
OurApp.put("/book/updateTitle/:isbn", (req, res) => {
  const { updatedBook } = req.body;
  const { isbn } = req.params;

  Database.Book.forEach((book) => {
    if (book.ISBN === isbn) {
      book.title = updatedBook.title;
      return book;
    }
    return book;
  });

  return res.json(Database.Book);
});

// Route    - /book/updateAuthor/:isbn
// Desc     - to update/add new author
// Access   - Public
// Method   - put
// Params   - isbn
// Body     - none
OurApp.put("/book/updateAuthor/:isbn", (req, res) => {
  const { newAuthor } = req.body;
  const { isbn } = req.params;

  Database.Book.forEach((book) => {
    if (book.ISBN === isbn) {
      if (!book.authors.includes(newAuthor)) {
        book.authors.push(newAuthor);
        return book;
      }

      return book;
    }
    return book;
  });

  Database.Author.forEach((author) => {
    if (author.id === newAuthor) {
      if (!author.books.includes(isbn)) {
        author.books.push(isbn);
        return author;
      }

      return author;
    }
    return author;
  });

  return res.json({ book: Database.Book, author: Database.Author });
});

// Route    - /author/updateName/:id
// Desc     - update author details
// Access   - Public
// Method   - put
// Params   - id
// Body     - none
OurApp.put("/author/updateName/:id", (req, res) => {
  const { updateAuthor } = req.body;
  const { id } = req.params;

  const author = Database.Author.map((author) => {
    if (author.id === parseInt(id)) {
      return { ...author, ...updateAuthor };
    }
    return author;
  });

  return res.json(author);
});

// Route    - /publications/update/:id
// Desc     - update publication
// Access   - Public
// Method   - put
// Params   - id
// Body     - none
OurApp.put("/publications/update/:id", (req, res) => {
  const { updatedPublication } = req.body;
  const { id } = req.params;

  const publication = Database.Publication.map((publication) => {
    if (publication.id === parseInt(id)) {
      return { ...publication, ...updatedPublication };
    }
    return publication;
  });

  return res.json(publication);
});

// Route    - /publications/updateBook/:id
// Desc     - to update/add new book
// Access   - Public
// Method   - put
// Params   - isbn
// Body     - none
OurApp.put("/publications/updateBook/:id", (req, res) => {
  const { newBook } = req.body;
  const { id } = req.params;

  Database.Publication.forEach((pub) => {
    if (pub.id === parseInt(id)) {
      if (!pub.books.includes(newBook)) {
        pub.books.push(newBook);
        return pub;
      }

      return pub;
    }
    return pub;
  });

  Database.Book.forEach((book) => {
    if (book.ISBN === newBook) {
      book.publication = req.params.id;
    }
  });

  return res.json({ publication: Database.Publication, book: Database.Book });
});

// Route    - /book/delete/:isbn
// Desc     - delete a book
// Access   - Public
// Method   - delete
// Params   - isbn
// Body     - none
OurApp.delete("/book/delete/:isbn", (req, res) => {
  const { isbn } = req.params;
  const filteredBooks = Database.Book.filter((book) => book.ISBN !== isbn);
  Database.Book = filteredBooks;
  return res.json(Database.Book);
});

// Route    - /book/delete/author/:isbn/:id
// Desc     - delete an author from the book
// Access   - Public
// Method   - delete
// Params   - isbn, id
// Body     - none
OurApp.delete("/book/delete/author/:isbn/:id", (req, res) => {
  const { isbn, id } = req.params;
  Database.Book.forEach((book) => {
    if (book.ISBN === isbn) {
      if (!book.authors.includes(parseInt(id))) {
        return book;
      }

      book.authors = book.authors.filter(
        (databaseId) => databaseId !== parseInt(id)
      );
      return book;
    }
    return book;
  });

  Database.Author.forEach((author) => {
    if (author.id === parseInt(id)) {
      if (!author.books.includes(isbn)) {
        return author;
      }

      author.books = author.books.filter((book) => book !== isbn);
      return author;
    }
  });

  return res.json({ book: Database.Book, author: Database.Author });
});

// Route    - /author/delete/:id
// Desc     - delete an author
// Access   - Public
// Method   - delete
// Params   - id
// Body     - none
OurApp.delete("/author/delete/:id", (req, res) => {
  const { id } = req.params;
  const filteredAuthors = Database.Author.filter(
    (author) => author.id !== parseInt(id)
  );

  Database.Author = filteredAuthors;

  return res.json(Database.Author);
});

// Route    - /publication/delete/:id
// Desc     - delete an author
// Access   - Public
// Method   - delete
// Params   - id
// Body     - none
OurApp.delete("/publication/delete/:id", (req, res) => {
  const { id } = req.params;
  const filteredPub = Database.Publication.filter(
    (pub) => pub.id !== parseInt(id)
  );

  Database.Publication = filteredPub;

  return res.json(Database.Publication);
});

// Route    - /publication/delete/book
// Desc     - delete a book from publication
// Access   - Public
// Method   - delete
// Params   - id, isbn
// Body     - none

OurApp.delete("/publication/delete/book/:isbn/:id", (req, res) => {
  const { isbn, id } = req.params;

  Database.Book.forEach((book) => {
    if (book.ISBN === isbn) {
      book.publication = 0;
      return book;
    }
    return book;
  });

  Database.Publication.forEach((publication) => {
    if (publication.id === parseInt(id)) {
      const filteredBooks = publication.books.filter((book) => book !== isbn);
      publication.books = filteredBooks;
      return publication;
    }
    return publication;
  });

  return res.json({ book: Database.Book, publication: Database.Publication });
});

OurApp.listen(4000, () => console.log("Server is up👍"));
