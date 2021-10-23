require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//API
const Book = require("./API/book");
const Author = require("./API/author");
const Publication = require("./API/publication");

// connecting to mongoose
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

// initialization
const OurApp = express();
OurApp.use(express.json());

// Microservices
OurApp.use("/book", Book);
OurApp.use("/author", Author);
OurApp.use("/publication", Publication);

OurApp.get("/", (request, response) => {
  response.json({ message: "Request served!!!!" });
});

OurApp.listen(4000, () => console.log("Server is up👍"));
