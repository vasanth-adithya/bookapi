const Router = require("express").Router();
const BookModel = require("../schema/book");
const PublicationModel = require("../schema/publication");

// Route    - /publications
// Desc     - to get all publication
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/", async (req, res) => {
  const getAllPublications = await PublicationModel.find();

  return res.json(getAllPublications);
});

// Route    - /publications/:publicationID
// Desc     - to get specific publication
// Access   - Public
// Method   - GET
// Params   - publicationID
// Body     - none
Router.get("/:publicationID", async (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({
    id: req.params.publicationID,
  });

  if (!getSpecificPublication) {
    return res.json({
      error: `No publication found for id of ${parseInt(
        req.params.publicationID
      )}`,
    });
  }

  return res.json(getSpecificPublication);
});

// Route    - /publications/book/:isbn
// Desc     - to get a list of publication based on a book.
// Access   - Public
// Method   - GET
// Params   - isbn
// Body     - none
Router.get("/publications/book/:isbn", (req, res) => {
  const getPublication = Database.Publication.filter((publication) =>
    publication.book.includes(req.params.isbn)
  );
  res.json(getPublication);
});

// Route    - /publications/new
// Desc     - Add new publication
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
Router.post("/publications/new", (req, res) => {
  const { newPublication } = req.body;
  Database.Publication.push(newPublication);
  return res.json(Database.Publication);
});

// Route    - /publications/update/:id
// Desc     - update publication
// Access   - Public
// Method   - put
// Params   - id
// Body     - none
Router.put("/publications/update/:id", (req, res) => {
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
Router.put("/publications/updateBook/:id", (req, res) => {
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

// Route    - /publication/delete/:id
// Desc     - delete an author
// Access   - Public
// Method   - delete
// Params   - id
// Body     - none
Router.delete("/publication/delete/:id", (req, res) => {
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

Router.delete("/publication/delete/book/:isbn/:id", (req, res) => {
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
module.exports = Router;
