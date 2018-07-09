const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../config');

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
                message: 'That bitch already deepthroated my condo, next please!'
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
                message: 'Enjoy your stay, skinny buttless-bitch',
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
                    message: 'you not gotting inda hole if you aint valid bitch'
                });
            } else {
                var token = jwt.sign({
                    user: user
                }, config.secret, {
                        expiresIn: '7d'
                    });

                res.json({
                    success: true,
                    message: 'Enjoy your stay, puffy dickhead',
                    token: token
                });
            }
        }
    });
});


module.exports = router;