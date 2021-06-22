'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
server.use(cors());

server.use(express.json());

const PORT = process.env.PORT || 3030


mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });



const booksSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
});


const userSchema = new mongoose.Schema({
    email: String,
    books: [booksSchema],

});



const booksModel = mongoose.model('books', booksSchema);
const userModel = mongoose.model('user', userSchema);


function booksSeeding() {

    const Silent = new booksModel({
        name: 'The Silent Patient',
        description: 'a women may or may not have killed her husband and a theapist is determind to make her talk to discover her secrets.',
        status: 'LIFE-CHANGING',
    })

    const Gallaxy = new booksModel({
        name: 'The Hitchhickers Guide To The Gallaxy',
        description: 'earth is destroyed and folks try to determine the ultimate question to the universe and everything.',
        status: 'RECOMMENDED TO ME',
    })

    Silent.save();
    Gallaxy.save()
};
// booksSeeding();

function userSeeding() {
    const feras = new userModel({
        email: 'ferasezaldeen@gmail.com',
        books: [
            {
                name: 'The Silent Patient',
                description: 'a women may or may not have killed her husband and a theapist is determind to make her talk to discover her secrets.',
                status: 'LIFE-CHANGING',

            },
            {
                name: 'The Hitchhickers Guide To The Gallaxy',
                description: 'earth is destroyed and folks try to determine the ultimate question to the universe and everything.',
                status: 'RECOMMENDED TO ME',

            }
        ],
    })

    feras.save()
};

// userSeeding();

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});


server.get('/books', getbooksHandler);
server.post('/addBooks', postNewBook);
server.delete('/delBooks', deleteBook);

function getbooksHandler(req, res) {
    let requestedemail = req.query.email
    userModel.find({ email: requestedemail }, function (err, ownerData) {
        if (err) {
            console.log('something went wrong');
        }
        else {
            // console.log(ownerData, 'hello from the other string');
            // console.log(ownerData[3].books);
            res.send(ownerData[0].books);
        }
    })

};

function postNewBook(req, res) {
    const { name, description, status, email } = req.body;
    userModel.find({ email: email }, (error, ownerData) => {
        if (error) {
            res.send('something went wrong');

        }
        else {
            console.log(email);
            console.log(ownerData[0]);
            ownerData[0].books.push({
                name: name,
                description: description,
                status: status,
            })
            ownerData[0].save();
            res.send(ownerData[0].books);
        }


    })

};


function deleteBook(req, res) {
    const { email, index } = req.query;
    console.log(req.query.email);
    userModel.find({ email: email }, (error, ownerData) => {
        if (error) {
            console.log('rrrrr');

            res.send('something went wrong');
        }
        else {
            console.log(email);
            console.log(ownerData[0]);
            const newCollection = ownerData[0].books.filter((item, idx) => {
                if (idx !== Number(index)) {
                    return item;
                }

               


            })
            ownerData[0].books = newCollection;
            ownerData[0].save();
            res.send(ownerData[0].books);
        }


    })

}