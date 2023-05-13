const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userSchema);


// Create a register page
app.post('/', (req, res) => {
    const newUser = new User({

        // String placeholder in case React App
        email: req.body.String, 
        password: req.body.String
    });

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