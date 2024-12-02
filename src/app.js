const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let ejs = require('ejs');
require("dotenv").config()

mongoose.connect('mongodb://127.0.0.1:27017/yadegariDB', {useNewUrlParser: true, useUnifiedTopology: true});

const memoSchema = new mongoose.Schema({
    author: String,
    date: String,
    message: String
});
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    memos: [memoSchema]
});

const Memo = new mongoose.model('Memo', memoSchema);
const User = new mongoose.model('User', userSchema);
const app = express();
const port = process.env.PORT

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('introduction');
})

app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

app.get('/sign-in', (req, res) => {
    res.render('sign-in')
});


app.get('/:userAddress', (req, res) => {
    const userAddress = req.params.userAddress;
    User.findOne({username: userAddress}, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!foundUser) {
                res.render('no-such-user');
            }
            else {
                res.render('new-memo', {username: foundUser.username, name: foundUser.name})
            }
        }
    })
});

app.post('/sign-up', (req, res) => {

    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                res.render('sign-up-failure');
            }
            else {
                const newUser = new User({
                    username:  username,
                    password: password,
                    name: name
                });
                newUser.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.render('user-memos', {username: newUser.username, name: newUser.name, memos: newUser.memos});
                    }
                });
            }
        }
    });
});

app.post('/sign-in', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!foundUser) {
                res.render('not-registered');
            }
            else {
                if (password !== foundUser.password) {
                    res.render('wrong-password');
                }
                else {
                    res.render('user-memos', {username: foundUser.username, name: foundUser.name, memos: foundUser.memos});
                }
            }
        }
    });
});

app.post('/new-memo', (req, res) => {
    var author = req.body.author;
    if (author === "") {
        author = "ناشناس";
    }
    const username = req.body.username;
    const memo = req.body.memo;

    newMemo = new Memo({
        author: author,
        date: new Date().toLocaleString('fa-IR'),
        message: memo
    });
    
    newMemo.save();

    User.findOne({username: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            foundUser.memos.push(newMemo);
            foundUser.save();
            res.render('thanks');
        }
    });
});


app.listen(port, () => {
    console.log("Server is listening on http://localhost:" + port);
});
