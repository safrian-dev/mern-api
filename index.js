const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');
const multer = require('multer');
const path = require('path');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());// data yang akan diterima adalah type json

// middleware
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// mengatasi cors
app.use((req, res, next) => {
    // beberapa ketentuan
    // res.setHeader('Access-Control-Allow-Origin', 'https://codepen.io'); // hanya url spesifik yg bisa mengakses api
    res.setHeader('Access-Control-Allow-Origin', '*'); // untuk bisa diakses semua url dari luar

    // method apa saja yang diizinkan
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    // headers apa saja yang boleh dikirim
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');

    next(); // LANJUTKAN!!
})

app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

// default error
app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    });

});

mongoose.connect('mongodb://rian:Mybp3dtwM729eOiZ@learn-nodejs-shard-00-00.3nsaa.mongodb.net:27017,learn-nodejs-shard-00-01.3nsaa.mongodb.net:27017,learn-nodejs-shard-00-02.3nsaa.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-khjmlp-shard-0&authSource=admin&retryWrites=true&w=majority')
    .then(() => {
        app.listen(4000, () => console.log('Connection Success!')); // set port
    })
    .catch(err => console.log(err));
