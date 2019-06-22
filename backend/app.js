const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const app = express();

mongoose.connect('mongodb+srv://banjos:fcRLzkuT1GvThuWR@cluster0-fvwly.mongodb.net/node-angular?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to database! É nois bixão que voa!!!');
    })
    .catch(() => {
        console.log('Deu ruim');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//To solve CORS problem (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-Width, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
})
// fcRLzkuT1GvThuWR

app.use('/api/posts', postsRoutes);

module.exports = app;