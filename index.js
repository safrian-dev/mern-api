const express = require('express');
const app = express();
const productRoutes = require('./src/routes/products');

app.use(express.urlencoded({extended: true}));
app.use(express.json());// data yang akan diterima adalah type json

// mengatasi cors
app.use((req,res, next) => {
    // beberapa ketentuan
    // res.setHeader('Access-Control-Allow-Origin', 'https://codepen.io'); // hanya url spesifik yg bisa mengakses api
    res.setHeader('Access-Control-Allow-Origin', '*'); // untuk bisa diakses semua url dari luar

    // method apa saja yang diizinkan
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    // headers apa saja yang boleh dikirim
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');

    next(); // LANJUTKAN!!
})

app.use('/v1/customer', productRoutes);

app.listen(4000) // set port