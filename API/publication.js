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
Router.get("/book/:isbn", async (req, res) => {
  const getSpecificBook = await PublicationModel.findOne({
    books: req.params.isbn,
  });

  if (!getSpecificBook) {
    return res.json({
      error: `No publication found for the book ${req.params.isbn}`,
    });
  }

  return res.json(getSpecificBook);
});

// Route    - /publications/new
// Desc     - Add new publication
// Access   - Public
// Method   - post
// Params   - none
// Body     - { newPublication: { details } }
Router.post("/new", async (req, res) => {
  try {
    const { newPublication } = req.body;
    await PublicationModel.create(newPublication);
    return res.json({ message: "Publication added successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// Route    - /publications/update/:id
// Desc     - update publication
// Access   - Public
// Method   - put
// Params   - id
// Body     - { "name": { newName } }
Router.put("/update/:id", async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.id),
    },
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );

  return res.json(updatedPublication);
});

// Route    - /publications/updateBook/:id
// Desc     - to update/add new book
// Access   - Public
// Method   - put
// Params   - isbn
// Body     - { "book": ISBN }
Router.put("/updateBook/:id", async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.id),
    },
    {
      $addToSet: {
        books: req.body.book,
      },
    },
    {
      new: true,
    }
  );

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.body.book,
    },
    {
      publication: parseInt(req.params.id),
    },
    {
      new: true,
    }
  );

  return res.json({ publication: updatedPublication, book: updatedBook });
});

// Route    - /publication/delete/:id
// Desc     - delete a publication
// Access   - Public
// Method   - delete
// Params   - id
// Body     - none
Router.delete("/delete/:id", async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });

  return res.json({ publications: updatedPublication });
});

// Route    - /publication/delete/book
// Desc     - delete a book from publication
// Access   - Public
// Method   - delete
// Params   - id, isbn
// Body     - none
Router.delete("/delete/book/:isbn/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const isbn = req.params.isbn;

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: id,
    },
    {
      $pull: {
        books: isbn,
      },
    },
    {
      new: true,
    }
  );

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      publication: 0,
    },
    {
      new: true,
    }
  );

  return res.json({ publication: updatedPublication, book: updatedBook });
});

module.exports = Router;
