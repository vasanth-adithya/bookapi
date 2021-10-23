const AuthorModel = require("../schema/author");

const Router = require("express").Router();

// Route    - /author
// Desc     - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

// Route    - /author/:authorID
// Desc     - to get specific author
// Access   - Public
// Method   - GET
// Params   - authorID
// Body     - none
Router.get("/:authorID", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    id: parseInt(req.params.authorID),
  });

  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found for id ${parseInt(req.params.authorID)}`,
    });
  }

  return res.json({ author: getSpecificAuthor });
});

// Route    - /author/book/:isbn
// Desc     - to get list of author based on a book
// Access   - Public
// Method   - GET
// Params   - isbn
// Body     - none
Router.get("/book/:isbn", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.find({
    books: req.params.isbn,
  });

  return res.json({ author: getSpecificAuthor });
});

// Route    - /author/new
// Desc     - to add new author
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
Router.post("/new", (req, res) => {
  const { newAuthor } = req.body;
  AuthorModel.create(newAuthor);
  return res.json({ message: "Author added to the Databse." });
});

// Route    - /author/updateName/:id
// Desc     - update author details
// Access   - Public
// Method   - put
// Params   - id
// Body     - none
Router.put("/updateName/:id", async (req, res) => {
  const updateAuthor = await AuthorModel.findOneAndUpdate(
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

  return res.json({ author: updateAuthor });
});

// Route    - /author/delete/:id
// Desc     - delete an author
// Access   - Public
// Method   - delete
// Params   - id
// Body     - none
Router.delete("/delete/:id", async (req, res) => {
  const updateAuthor = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });

  return res.json({ authors: updateAuthor });
});

module.exports = Router;
