const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

// Local Host server file viewer
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Mongoose connection
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// Mongoose userSchema
const userSchema = {
    email: String,
    password: String
};


// Mongoose Schema model
const User = new mongoose.model("User", userSchema);


// Create a register page
app.post('/', (req, res) => {
    const newUser = new User({

        // String placeholder in case React App
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
            console.log(err)
        } else{
            res.sendFile(__dirname + '/index.html');
        }
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


app.listen(3000, () => {
  console.log('Server started on port 3000');
});