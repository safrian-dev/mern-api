exports.createProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    res.json(
        { 
            message: "Create product success!",
            data: {
                id: 'jfhw9eyweu9ww7e',
                name: name,
                price: price
            }
        }
    );
    next();
}

exports.getAllProducts = (req, res, next) => {
    res.json(
        { 
            message: "Get all products success!",
            data: {
                id: 'skdjbw9e8u238',
                name: 'Nutri Sari',
                price: 10000
            }
            
        }
    );
    next();
}