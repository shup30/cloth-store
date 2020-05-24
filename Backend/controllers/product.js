const Product = require('../Models/product');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.productsById = (req, res, next, id) => {
    Product.findById(id)
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name role')
        .select('_id type name created price')
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: err
                });
            }
            req.product = product;
            next();
        });
};

/*
exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .select("_id title body created likes")
        .sort({ created: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};
*/

// with pagination
exports.getProducts = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 6;
    let totalItems;

    const products = await Product.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Product.find()
                .skip((currentPage - 1) * perPage)
                .populate('postedBy', '_id name')
                .select('_id type name created price')
                .limit(perPage)
                .sort({ created: -1 });
        })
        .then(products => {
            res.status(200).json(products);
        })
        .catch(err => console.log(err));
};

exports.createProduct = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        let product = new Product(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.productsByUser = (req, res) => {
    Product.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id type name created price')
        .sort('_created')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(products);
        });
};

exports.isPoster = (req, res, next) => {
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    let adminUser = req.post && req.auth && req.auth.role === 'admin';

    // console.log("req.post ", req.post, " req.auth ", req.auth);
    // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

    let isPoster = sameUser || adminUser;

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

// exports.updatePost = (req, res, next) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(post);
//     });
// };

exports.updateProduct = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let product = req.product;
        product = _.extend(post, fields);
        product.updated = Date.now();

        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(product);
        });
    });
};

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, product) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Product deleted successfully'
        });
    });
};

exports.photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

exports.singleProduct = (req, res) => {
    return res.json(req.product);
};

