const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Post = require('./models/post');

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
app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    // console.log(post);
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id
        });
    });
});

app.put('/api/posts/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    console.log('app id: ' + req.params.id + ' title: ' + req.body.title + ' content: ' + req.body.content);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Updated successfull!' });
    });
});

app.get('/api/posts', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: "Posts feched successfully!",
            posts: documents
        });
    });
});


app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Post Deleted!' });
        });
});
// app.get('/api/posts', (req, res, next) => {
//     const posts = [
//         {
//             id: "Post 1",
//             title: "Fisrt server-side post",
//             content: "This is comming from the server"
//         },
//         {
//             id: "Post 2",
//             title: "Second server-side post",
//             content: "This is comming from the server"
//         }
//     ];
//     res.status(200).json({
//         message: "Posts feched succes",
//         posts: posts
//     });
// });

module.exports = app;