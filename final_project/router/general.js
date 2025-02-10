const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username) {
    return res.status(400).json({message: "missing username"});
  } else if (!password) {
    return res.status(400).json({message: "missing password"});
  } 
  else if (!isValid(username)) {
    return res.status(400).json({message: "username invalid"});
  }
  else {
    users.push({username, password});
    return res.status(200).json({message: "user registered"});
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  console.log('get_books...');
  console.log(books);
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const key = req.params.isbn;
  if (key in books) {
    return res.status(200).json(books[key]);
  } else {
    return res.status(404).json({message: "book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filtered_books = Object.values(books).filter((book)=>book.author === author) || [];
  const sorted_books = filtered_books.sort((a,b)=>a.title.localeCompare(b.title));
  return res.status(200).json(sorted_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const filtered_books = Object.values(books).filter((book)=>book.title === title) || [];
  const sorted_books = filtered_books.sort((a,b)=>a.author.localeCompare(b.author));
  return res.status(200).json(sorted_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const key = req.params.isbn;
  if (key in books) {
    const selected_book = books[key];
    return res.status(200).json(selected_book.reviews);
  } else {
    return res.status(404).json({message: "book not found"});
  }
});

module.exports.general = public_users;
