const express = require('express');

const app = express();

app.use(() => {
    console.log('server berhasil berjalan');
    console.log('');  
})

app.listen(4000) // set port