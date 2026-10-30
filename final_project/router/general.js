const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get all books using Promise / Async-Await
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await new Promise((resolve) => resolve(books));
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(err.status || 404).json({ message: err.message }));
});

// Task 3 & Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  const authorName = req.params.author.toLowerCase();

  try {
    const booksByAuthor = await new Promise((resolve, reject) => {
      let matched = [];
      Object.keys(books).forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === authorName) {
          matched.push({ isbn, ...books[isbn] });
        }
      });
      if (matched.length > 0) resolve(matched);
      else reject({ status: 404, message: "Author not found" });
    });

    return res.status(200).json({ booksbyauthor: booksByAuthor });
  } catch (err) {
    return res.status(err.status || 404).json({ message: err.message });
  }
});

// Task 4 & Task 13: Get book details based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
  const titleName = req.params.title.toLowerCase();

  try {
    const booksByTitle = await new Promise((resolve, reject) => {
      let matched = [];
      Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === titleName) {
          matched.push({ isbn, ...books[isbn] });
        }
      });
      if (matched.length > 0) resolve(matched);
      else reject({ status: 404, message: "Title not found" });
    });

    return res.status(200).json({ booksbytitle: booksByTitle });
  } catch (err) {
    return res.status(err.status || 404).json({ message: err.message });
  }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
