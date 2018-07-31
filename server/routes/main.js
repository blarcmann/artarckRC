const router = require('express').Router();
const async = require('async');
const stripe = require('stripe')('sk_test_9LOBWYBd2gKwUVhQgFIbOoG4');

const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');
const checkJWT = require('../middlewares/check-jwt');
const Order = require('../models/order');

router.route('/categories')
    .get((req, res, next) => {
        Category.find({}, (err, categories) => {
            if (err) return err;

            res.json({
                success: true,
                message: 'Categories successfully populated :)',
                categories: categories
            })
        })
    })
    .post((req, res, next) => {
        let category = new Category();

        category.name = req.body.category;
        category.save();
        res.json({
            success: true,
            message: "Created Successfully"
        });

    });


router.get('/products', (req, res, next) => {
    const perPage = 12;
    const page = req.query.page;
    async.parallel([
        function (callback) {
            Product.count({}, (err, count) => {
                var totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function (callback) {
            Product.find({})
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) => {
                    if (err) return next(err);
                    callback(err, products);
                });
        }
    ],
        function (err, results) {
            var totalProducts = results[0];
            var products = results[1];

            res.json({
                success: true,
                message: 'Products',
                products: products,
                totalProducts: totalProducts,
                pages: Math.ceil(totalProducts / perPage)
            });
        });
});



router.get('/product/:id', (req, res, next) => {
    Product.findById({ _id: req.params.id })
        .populate('category')
        .populate('owner')
        .deepPopulate('reviews.owner')
        .deepPopulate('reviews.rating')
        .exec((err, product) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Product not found'
                });
            } else {
                if (product) {
                    res.json({
                        success: true,
                        message: 'Product found',
                        product: product
                    });
                }
            }
        });
});


router.get('/categories/:id', (req, res, next) => {
    const perPage = 12;
    const page = req.query.page;
    async.parallel([
        function (callback) {
            Product.count({ category: req.params.id }, (err, count) => {
                var totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function (callback) {
            Product.find({ category: req.params.id })
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .deepPopulate('reviews.owner')
                .exec((err, products) => {
                    if (err) return next(err);
                    callback(err, products);
                });
        },
        function (callback) {
            Category.findOne({ _id: req.params.id }, (err, category) => {
                callback(err, category);
            });
        }
    ],
        function (err, results) {
            var totalProducts = results[0];
            var products = results[1];
            var category = results[2];

            res.json({
                success: true,
                message: 'category',
                products: products,
                categoryName: category.name,
                totalProducts: totalProducts,
                pages: Math.ceil(totalProducts / perPage)
            });
        });
});


router.post('/review', checkJWT, (req, res, next) => {
    async.waterfall([
        function (callback) {
            Product.findOne({ _id: req.body.productId }, (err, product) => {
                if (product) {
                    callback(err, product);
                }
            });
        },

        function (product) {
            let review = new Review();
            review.owner = req.decoded.user._id;

            if (req.body.title) review.title = req.body.title;
            if (req.body.description) review.description = req.body.description;
            if (req.body.rating) review.rating = req.body.rating;


            product.reviews.push(review._id);
            product.save();
            review.save();
            res.json({
                success: true,
                message: 'successfully added the review, thanks!'
            });
        }
    ]);
});


router.post('/payment', checkJWT, (req, res, next) => {
    const stripeToken = req.body.stripeToken;
    const currentCharges = Math.round(req.body.totalPrice * 100);

    stripe.customers
        .create({
            source: stripeToken.id
        })
        .then(function (customer) {
            return stripe.charges.create({
                amount: currentCharges,
                currency: 'usd',
                customer: customer.id
            });
        })
        .then(function (charge) {
            const products = req.body.products;

            let order = new Order();
            order.owner = req.decoded.user._id,
                order.totalPrice = currentCharges;

            products.map(product => {
                order.product.push({
                    product: product.product,
                    quantity: product.quantity
                });
            });

            order.save();
            res.json({
                success: true,
                message: 'Payment successfully made'
            });
        });
});


module.exports = router;