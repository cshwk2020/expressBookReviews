const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const BOOK_URL = "http://localhost:5000";

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
  return res.status(200).json(books); 
});

 
// Get book details based on ISBN
// Task 1
/*
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const key = req.params.isbn;
  if (key in books) {
    return res.status(200).json(books[key]);
  } else {
    return res.status(404).json({message: "book not found"});
  }
 });
 */

 // Task 1 -> 10
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  console.log("get isbn...");
  try {
    const books = (await axios.get(BOOK_URL)).data;
    console.log("books==>",books);

    const key = req.params.isbn;
    if (key in books) {
      return res.status(200).json(books[key]);
    } else {
      return res.status(404).json({message: "book not found"});
    }

  } catch (err) {
    return res.status(500).json({message: err});
  }

 });

  
// Get book details based on author
// Task 2
/*
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filtered_books = Object.values(books).filter((book)=>book.author === author) || [];
  const sorted_books = filtered_books.sort((a,b)=>a.title.localeCompare(b.title));
  return res.status(200).json(sorted_books);
});
*/

// Task 2 -> 11
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try {
    const books = (await axios.get(BOOK_URL)).data;
    const author = req.params.author;
    const filtered_books = Object.values(books).filter((book)=>book.author === author) || [];
    const sorted_books = filtered_books.sort((a,b)=>a.title.localeCompare(b.title));
    return res.status(200).json(sorted_books);
  } catch (err) {
    return res.status(500).json({message: err});
  }
   
});


// Get all books based on title
// Task 3
/*
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const filtered_books = Object.values(books).filter((book)=>book.title === title) || [];
  const sorted_books = filtered_books.sort((a,b)=>a.author.localeCompare(b.author));
  return res.status(200).json(sorted_books);
});
*/

// Task 3 -> 12
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
   
  try {
    const books = (await axios.get(BOOK_URL)).data;
    const title = req.params.title;
    const filtered_books = Object.values(books).filter((book)=>book.title === title) || [];
    const sorted_books = filtered_books.sort((a,b)=>a.author.localeCompare(b.author));
    return res.status(200).json(sorted_books);

  } catch (err) {
    return res.status(500).json({message: err});
  }
});

//  Get book review
//  Task 4
/*
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
*/



//  Get book review
//  Task 4 -> 13
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  try {
    const books = (await axios.get(BOOK_URL)).data;
    const key = req.params.isbn;
    console.log("key==", key);
    if (key in books) {
      const selected_book = books[key];
      return res.status(200).json(selected_book.reviews);
    } else {
      return res.status(404).json({message: "book not found"});
    }

  } catch (err) {
    return res.status(500).json({message: err});
  }

});

module.exports.general = public_users;
