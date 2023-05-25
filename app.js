// Initalizing dotenv for Environment variables for storing secrets and keys
require('dotenv').config()
const express = require('express');
const app = express();

// Adding md5 hash package
const md5 = require('md5');

// Adding bcrypt hash package
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Passport authentication step by step: IMPORTANT
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const mongoose = require('mongoose');

// Standard mongoose library for encryption
const encrypt = require('mongoose-encryption');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));


// Initializing session with tailored options, use documentation for details
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// Mongoose connection
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// Mongoose userSchema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Mongoose Encrypted Schema
const encryptedUserSchema = new mongoose.Schema({
    encryptedEmail: String,
    encryptedPassword: String
});

// Mongoose-encryption Encryption key and Signing key using .env environment, renaming SOME_32BYTE_BASE64_STRING and SOME_64BYTE_BASE64_STRING respectively

// Having a crypto generator for the keys by importing crypto module

const crypto = require('crypto');

// Function for generating Cryptokey using keyLength as parameters 32 or 64
function generateCryptoKey(keyLength){
    return crypto.randomBytes(keyLength);
}

// Logging the generated crypto key to migrate into .env

const encryptionKeyRandom32 = generateCryptoKey(32);
console.log(encryptionKeyRandom32.toString('base64'));

const encryptionKeyRandom64 = generateCryptoKey(64);
console.log(encryptionKeyRandom64.toString('base64'));


let encKey = process.env.ENCRYPTKEY32;
let sigKey = process.env.SIGNKEY64;

// Using custom encryption key moved into .env environment

let customEncryptkey = process.env.CUSTOMENCRYPTKEY32;

// Using the plugin for the Schema w/ specification in encryptedFields of which field to be encrypted
// Remove encryptedFields to encrypt everything, encrypt with save, decrypt in find
encryptedUserSchema.plugin(encrypt, {encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['password']});

// Using custom encryption key commented for later use since only one schema for encryption
// encryptedUserSchema.plugin(encrypt, {encryptionKey: customEncryptkey, signingKey: sigKey, encryptedFields: ['password']});
 
// Mongoose Schema model
const User = new mongoose.model("User", userSchema);
// Mongoose Encrypted model
const EncryptedUser = new mongoose.model("Encrypted User", encryptedUserSchema);

// Local Host server file viewer
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  

// Create a register page
app.post('/', (req, res) => {
    const newUser = new User({

        // String placeholder in case React App
        // String as placeholders for {email, password} form field

        email: req.body.String, 
        password: req.body.String
    });

    // String constraints for password generation
    const password_constrained = document.getElementById('password').value;
    if (password_constrained === ''){
        console.log('Password must not be blank.');
    }

    // If password is less than 8 characters
    if (password_constrained.length() < 8){
        console.log('Password must contain 8 characters.');
    }

    if (password_constrained.charAt(0) === password_constrained.toLowerCase()){
        console.log('Password first character must be a capital letter.');
    }

    // String Regex for minimum 8 characters, at least one letter and one number:
    const regex8Char1Let1Num = "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$";

    // String Regex for minimum eight characters, at least one letter, one number and one special character:
    const regex8Char1Let1Num1Spec = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";

    // String Regex for minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
    const regex8Char1LetUpper1LetLower1Num = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$";

    // String Regex for minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    const regex8Char1LetUpper1LetLower1Num1Spec = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";

    // String Regex for minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    const regex8Char10LetUpper1LetLower1num1Special = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$";


    newUser.save((err) => {
        if (err){
            console.log(err);
        } else{
            res.sendFile(__dirname + '/index.html');
        }
    });
});

// POST method for creating Encrypted user
app.post('/', (req, res) => {
    const newEncryptedUser = new EncryptedUser({

        // String as placeholders for {email, password} form field
        encryptedEmail: req.body.String,
        encryptedPassword: req.body.String
    });

    newEncryptedUser.save((err) => {
        if (err){
            console.log(err);
        } else{
            res.sendFile(__dirname + '/index.html');
        }
    });

});

// POST method for creating Hashed user using User Schema since using md5 package to Hash

app.post('/', (req, res) => {
    const newHashedUser = new User({
    
        email: req.body.String,
        hashPassword: md5(req.body.String),

    });

    newHashedUser.save((err) => {
        if (err){
            console.log(err);
        } else{
            res.sendFile(__dirname + '/index.html');
        }
    }); 

});

// POST method for creating Salted Hashed user using User Schema bcrypt library

app.post('/', (req, res) => {

    bcrypt.hash(req.body.String, saltRounds, (err, hash) => {
        const newSaltedHashedUser = new User({
                
            email: req.body.String,
            saltedHashPassword: hash

        });
        newSaltedHashedUser.save((err) => {
            if (err){
                console.log(err);
            } else{
                res.sendFile(__dirname + '/index.html');
            }
        });       
    });

});


// Create a log-in page
app.post('', (req, res) => {
    // Placeholder username & password class
    const username = req.body.username;
    const password = req.body.password;

    // foundUser === the username in the database
    User.findOne({email: username, password: password}, (err, foundUser) => {
        if (err){
            console.log(err);
        } else{
            if (foundUser){
                if (foundUser.password === password){
                    res.sendFile(__dirname + '/index.html');
                }
                else{
                    res.send('No users found!');
                }
            }
        }
    });
});

// Create a hashed log-in page
app.post('/', (req, res) => {
    // Placeholder username & password class
    const username = req.body.username;
    const password = md5(req.body.password);

    // foundUser === the username in the database
    User.findOne({email: username, password: password}, (err, foundUser) => {
        if (err){
            console.log(err);
        } else{
            if (foundUser){
                if (foundUser.password === password){
                    res.sendFile(__dirname + '/index.html');
                }
                else{
                    res.send('No users found!');
                }
            }
        }
    });
});

// Create a salted Hash log-in page
app.post('/', (req, res) => {
    // Placeholder username & password class
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username, password: password}, (err, foundUser) => {
        if (err){
            console.log(err);
        } else{
            if (foundUser){
                bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                    if (result === true){
                        res.sendFile(__dirname + '/index.html');
                    }
                });
            }
        }
    });
   
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// Level 1 is for User and Password
// Level 2 is for Encryption using .env and signkey
// Level 3 is for Hashing using MD5
// Level 4 is for Salting & Hashing using bCrypt
// Level 5 is for Cookies & Sessions using passport