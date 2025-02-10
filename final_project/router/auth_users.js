const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = 'your-secret-key'; 

const isValid = (username)=>{ 
  //returns boolean
  //write code to check is the username is valid
  const existing_users = users.filter((user)=>user.username===username) || [];
  return !((existing_users.length) > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  const filtered_users = users.filter((user)=>user.username===username && user.password===password) || [];
  return (filtered_users.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("login...");
  //Write your code here
  const {username,password} = req.body;
  const is_authenticated = authenticatedUser(username,password);

  if (is_authenticated) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' }); 
      return res.status(200).json({ token });
  } else {
      return res.status(400).json({message: "Invalid credentials"});
  }
   
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (!isbn) {
    return res.status(400).json({message: "isbn missing"});
  } 
  else if (!review) {
    return res.status(400).json({message: "review missing"});
  }
  else {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        // Verify JWT token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) { 
                return res.status(400).json({message: "Invalid token"});
            } else {
                // Token is valid, contineu with post review
                const username = decoded.username;
                if (isbn in books) {
                  const selected_book = books[isbn];
                  selected_book.reviews[username] = review;
                  return res.status(200).json({message: "review saved"});
                } else {
                  return res.status(400).json({message: "Book not found"});
                }
                 
            }
        });
    } 
    else {
        return res.status(400).json({message: "Token missing"});
    }
  }
  
});



// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  
  if (!isbn) {
    return res.status(400).json({message: "isbn missing"});
  } 

  else {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        // Verify JWT token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) { 
                return res.status(400).json({message: "Invalid token"});
            } else {
                // Token is valid, contineu with post review
                const username = decoded.username;
                if (isbn in books) {
                  const selected_book = books[isbn];
                  delete selected_book.reviews[username];
                  return res.status(200).json({message: "review deleted"});
                } else {
                  return res.status(400).json({message: "Book not found"});
                }
                 
            }
        });
    } 
    else {
        return res.status(400).json({message: "Token missing"});
    }
  }
  
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretKey = secretKey;
 
 
