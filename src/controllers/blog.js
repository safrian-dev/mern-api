const {validationResult} = require('express-validator');
const BlogPost = require('../models/blog');

exports.createBlogPost = (req, res, next) => {
    
    // ngecek error dari data post yang dikirim
    const erorrs = validationResult(req);
    
    if(!erorrs.isEmpty()){
        const err = new Error('Invalid value');
        err.errStatus = 400;
        err.data = erorrs.array();
        throw err;
    }
    
    if(!req.file) {
        const err = new Error('Image harus diupload');
        err.errStatus = 422;
        err.data = erorrs.array();
        throw err;
    }
    
    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        // static author
        author: {
            uid: 1,
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

exports.getAllBlogPost = (req, res, next) => {
    //memanggil semua data post
    BlogPost.find()
    .then(result => {
        res.status(200).json({
            message: 'Data Blog Post berhasil dipanggil',
            data: result
        })
    })
    .catch(err => {
        // info error akan langsung dikirimkan ke default error
        next(err);
    });
}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
    .then(result => {
        if(!result) {
            const error = new Error('Data tidak ditemukan'); 
            const errorStatus = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Data blog post berhasil dipanggil',
            data: result,  
        })
    })
    .catch(err => {
        next(err);
    });
}