const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    name: String,
    password: String,
    picture: String,
    isSeller: {
        type: Boolean,
        default: false
    },
    address: {
        addr1: String,
        addr2: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// UserSchema.pre('save', function (next) {
//     var user = this;
//     if (!user.isModified('password')) return next();

//     bcrypt.hash(this.password, 10, (err, hash) => {
//         if (err) {
//             return next(err);
//         }
//         this.password = hash;
//         next();
//     });
// });


UserSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

UserSchema.pre("update", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (candidatePassword){
    let password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};


UserSchema.methods.gravatar = function (size) {
    if (!this.size) size = 200;
    if (!this.email) {
        return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    } else {
        var md5 = crypto.createHash('md5').update(this.email).digest('hex');
        return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro';
    }
}

module.exports = mongoose.model('User', UserSchema);
