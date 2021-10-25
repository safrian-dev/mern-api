const {validationResult} = require('express-validator');

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

    const result = {
        message: "Create Blog Post Success",
        data:
        {
            "post_id": 1,
                "title" : title,
                // "image" : "imagefile.png",
                "body" : body,
                "created_at": "12/06/2020",
                "author" : {
                    "uid" : 1,
                    "name" : "Testing"
                }
        }
    }
    res.status(201).json(result);
}