const Router = require("express").Router();

const BookModel = require("../schema/book");
const AuthorModel = require("../schema/author");

// Route    - /book
// Desc     - To get all book
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

// Route    - /book/:bookID
// Desc     - To get a book based on ISBN
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
Router.get("/:bookID", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.bookID });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.bookID}`,
    });
  }

  return res.json(getSpecificBook);
});

// Route    - /book/c/:category
// Desc     - to get a list of book based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
Router.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.find({
    category: req.params.category,
  });

  if (!getSpecificBooks) {
    return res.json(`No book found for category ${req.params.category}`);
  }

  return res.json({ books: getSpecificBooks });
});

// Route    - /book/a/:authorID
// Desc     - to get a list of book based on author
// Access   - Public
// Method   - GET
// Params   - authorID
// Body     - none
Router.get("/a/:authorID", async (req, res) => {
  const getSpecificBooks = await BookModel.find({
    authors: parseInt(req.params.authorID),
  });

  if (!getSpecificBooks) {
    return res.json({
      message: `No book found for the author of ${parseInt(
        req.params.authorID
      )}`,
    });
  }

  return res.json({ books: getSpecificBooks });
});

// Route    - /book/new
// Desc     - to add new book
// Access   - Public
// Method   - post
// Params   - none
// Body     - { newBook : { details } }
Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;
    await BookModel.create(newBook);
    return res.json({ message: "Book added to the databse" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// Route    - /book/updateTitle/:isbn
// Desc     - to update book details
// Access   - Public
// Method   - put
// Params   - isbn
// Body     - { title: newTtile }
Router.put("/updateTitle/:isbn", async (req, res) => {
  const { title } = req.body.title;

  const updateBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: title,
    },
    {
      new: true,
    }
  );

  return res.json({ book: updateBook });
});

// Route    - /book/updateAuthor/:isbn
// Desc     - to update/add new author
// Access   - Public
// Method   - put
// Params   - isbn
// Body     - { "newAuthor": id }
Router.put("/updateAuthor/:isbn", async (req, res) => {
  const { newAuthor } = req.body;
  const { isbn } = req.params;
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      $addToSet: {
        authors: newAuthor,
      },
    },
    {
      new: true,
    }
  );

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: newAuthor,
    },
    {
      $addToSet: {
        books: isbn,
      },
    },
    {
      new: true,
    }
  );

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New author was added into the database",
  });
});

// Route    - /book/delete/:isbn
// Desc     - delete a book
// Access   - Public
// Method   - delete
// Params   - isbn
// Body     - none
Router.delete("/delete/:isbn", async (req, res) => {
  const { isbn } = req.params;

  const updateBookDatabase = await BookModel.findOneAndDelete({
    ISBN: isbn,
  });

  return res.json({ books: updateBookDatabase });
});

// Route    - /delete/author/:isbn/:id
// Desc     - delete an author from the book
// Access   - Public
// Method   - delete
// Params   - isbn, id
// Body     - none
Router.delete("/delete/author/:isbn/:id", async (req, res) => {
  const { isbn, id } = req.params;

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: isbn,
    },
    {
      $pull: {
        authors: parseInt(id),
      },
    },
    {
      new: true,
    }
  );

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(id),
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

  return res.json({
    message: "Author was deleted",
    book: updatedBook,
    author: updatedAuthor,
  });
});

module.exports = Router;
