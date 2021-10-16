const express = require("express");

const Database = require("./database");

const OurApp = express();

OurApp.get("/", (request, response) => {
  response.json({ message: "Request served!!!!" });
});

// Route    - /book
// Desc     - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
OurApp.get("/books", (req, res) => {
  res.json({ books: Database.Book });
});

// Route    - /book/bookID
// Desc     - To get a book based on ISBN
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
OurApp.get("/books/:bookID", (req, res) => {
  const getBook = Database.Book.filter(
    (book) => book.ISBN === req.params.bookID
  );

  return res.json(getBook);
});

// Route    - /book/c/:category
// Desc     - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
OurApp.get("/books/c/:category", (req, res) => {
  const getBook = Database.Book.filter((book) =>
    book.category.includes(req.params.category)
  );

  return res.json({ book: getBook });
});

// Route    - /book/a/:authorID
// Desc     - to get a list of books based on author
// Access   - Public
// Method   - GET
// Params   - authorID
// Body     - none
OurApp.get("/books/a/:authorID", (req, res) => {
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
    author.books.includes(req.params.isbn)
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
    publication.books.includes(req.params.isbn)
  );
  res.json(getPublication);
});

OurApp.listen(4000, () => console.log("Server is up👍"));
