const {validationResult} = require('express-validator');
const BlogPost = require('../models/blog');

exports.createBlogPost = (req, res, next) => {
    const title = req.body.title;
    // const image = req.body.image;
    const body = req.body.body;

    // ngecek error dari data post yang dikirim
    const erorrs = validationResult(req);

    if(!erorrs.isEmpty()){
        const err = new Error('Invalid value');
        err.errStatus = 400;
        err.data = erorrs.array();
        throw err;
    }

    const Posting = new BlogPost({
        title: title,
        body: body,
        // static author
        author: {
            id: 1,
            name: 'Rian Cellent'
        }
    });

    Posting.save()
    .then(result => {
        res.status(201).json ({
            message: "Create Blog Post Success",
            data: result
        });
    })
    .catch(err => {
        console.err('err :', err);
    });
}