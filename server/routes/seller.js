const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = require('express').Router();
const Product = require('../models/product');
const checkJWT = require('../middlewares/check-jwt');
const faker = require('faker');

const s3 = new aws.S3({
    accessKeyId: "AKIAJWE5ZGDCLSH6QPEQ",
    secretAccessKey: "caiPzIKTmEy4mKhdoZpYALqTvtRtmUpPgpYdMNui"
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'artarckrc',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})


router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({ owner: req.decoded.user._id })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (err) return err;

                if (products) {
                    res.json({
                        success: true,
                        message: "Products",
                        products: products
                    });
                }

            });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        console.log(upload);
        console.log(req.file);
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.descripton = req.body.descripton;
        product.image = req.file.location;

        product.save();
        res.json({
            success: true,
            message: "Successfully Added the Product"
        });
    });

// testing dummy data with faker

router.get('/faker/test', (req, res, next) => {
    for (i = 0; i < 20; i++) {
        let product = new Product();
        product.category = "5b46023ebb03671ac01545a5";
        product.owner = "5b447c951f2ffa199084fcf3";
        product.image = faker.image.nature();
        product.title = faker.commerce.productName();
        product.description = faker.random.words();
        product.price = faker.commerce.price();
        product.save()
    }

    res.json({
        message: "Succesfully added 20 products"
    });

})


module.exports = router;