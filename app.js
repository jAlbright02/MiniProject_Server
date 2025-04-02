const path = require('path');
const mongoose = require('mongoose')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const socMedRoutes = require('./routes/social_media');
app.use(express.json()) // Won't parse JSON data sent to server without this
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', socMedRoutes);

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/db')
    .then(res => {
        app.listen(3010)
    })
    .catch(err => {
        console.log('Mongoose connection error: ' + err)
    });
