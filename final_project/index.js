const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const secretKey = require('./router/auth_users.js').secretKey;
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        // Verify JWT token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) { 
                return res.status(400).json({message: "Invalid token"});
            } else {
                // Token is valid, contineu with target req
                next(); 
            }
        });
    } 
    else {
        return res.status(400).json({message: "Token missing"});
    }
    
});
    

const PORT =5000;

app.use(express.static('staticfiles'));
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
