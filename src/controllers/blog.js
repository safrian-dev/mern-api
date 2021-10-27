const {validationResult} = require('express-validator');
const BlogPost = require('../models/blog');
const path = require('path');
const fs = require('fs');
const { restart } = require('nodemon');

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
    // paging data & default value query
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    BlogPost.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return BlogPost.find()
        .skip((parseInt(currentPage) -1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Blog Post berhasil dipanggil',
            data: result,
            total_data: totalItems,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch(err => {
        next(err);
    })
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

exports.updateBlogPost = (req, res, next) => {
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
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error('Blog post tidak ditemukan');
            err.errStatus = 404;
            throw err;
        }

        post.title = title;
        post.body = body;
        post.image = image;
        
        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Update post sukses',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    });
}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error('Blog post tidak ditemukan');
            err.errStatus = 404;
            throw err;
        }

        // hapus image
        removeImage(post.image);

        // hapus post
        return BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
        res.status(200).json({
            message: 'Post berhasil dihapus',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    })
}

// method hapus image
const removeImage = (filePath) => {
    // console.log('filePath', filePath);
    // console.log('dir name: ', __dirname);

    filePath = path.join(__dirname, '../../', filePath);
    fs.unlink(filePath, err => console.log(err));
}