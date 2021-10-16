const express = require("express");

const OurApp = express();

OurApp.get("/hi/", (request, response) => {
  response.json({ message: "2.Request served!!!!" });
});

OurApp.get("/", (request, response) => {
  response.json({ message: "1.Request served!!!!" });
});

OurApp.listen(4000, () => console.log("Server is up👍"));
