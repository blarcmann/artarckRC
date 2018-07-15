const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt');

router.post('/signup', (req, res, next) => {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.pasword;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            throw err;
        }

        if (existingUser) {
            res.json({
                success: false,
                message: 'Invalid signup credential, seems the email has already been used'
            });
        } else {
            user.save();
            var token = jwt.sign({
                user: user
            }, config.secret, {
                    expiresIn: '7d'
                });

            res.json({
                success: true,
                message: 'Enjoy your stay, skinny',
                token: token
            });
        }
    });
});

router.post('/login', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {
                    message: 'Login credentials not valid, suspect user'
                }
            });
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Login credentials not valid, suspect password'
                });
            } else {
                var token = jwt.sign({
                    user: user
                }, config.secret, {
                        expiresIn: '7d'
                    });

                res.json({
                    success: true,
                    message: 'Enjoy your stay, biggy',
                    token: token
                });
            }
        }
    });
});


router.route('/profile')
    .get(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) return next(err);

            res.json({
                success: true,
                user: user,
                message: "Successful"
            });
        });
    })
    .post(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) return next(err);

            if (req.body.name) user.name = req.body.name
            if (req.body.email) user.email = req.body.email
            if (req.body.password) user.password = req.body.password
            user.isSeller = req.body.isSeller;
            user.update();
            user.save()

            res.json({
                success: true,
                message: "Profile successfully edited."
            });
        });
    });

router.route('/address')
    .get(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) return next(err);

            res.json({
                success: true,
                address: user.address,
                message: "Successfull"
            });
        });
    })
    .post(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) return next(err);

            if (req.body.addr1) user.address.addr1 = req.body.addr1
            if (req.body.addr2) user.address.addr2 = req.body.addr2
            if (req.body.city) user.address.city = req.body.city
            if (req.body.state) user.address.state = req.body.state
            if (req.body.country) user.address.country = req.body.country
            if (req.body.postalCode) user.address.postalCode = req.body.postalCode

            user.save();

            res.json({
                success: true,
                message: "Profile address successfully updated."
            });
        });
    });

module.exports = router;