const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = require('express').Router();
const Product = require('../models/product');
const checkJWT = require('../middlewares/check-jwt');

const s3 = new aws.S3({
    accessKeyId: "AKIAJWE5ZGDCLSH6QPEQ",
    secretAccessKey: "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"
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
    .get((req, res,next) => {
        res.json({
            success: "Hello"
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

module.exports = router;