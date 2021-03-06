const express = require('express'); // for http routes
const morgan = require('morgan'); // http request logger for nodejs
const bodyParser = require('body-parser'); // data reader,
const mongoose = require('mongoose'); //mongoDB agent, comm directly nodejs and mongo
const config = require('./config');
const cors = require('cors');

const app = express();
const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/product-search');

mongoose.connect(config.database, err => {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(morgan('dev'));
app.use(cors());

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', productSearchRoutes);

app.listen(config.port, err => {
    console.log('Shit happens on port ' + config.port);
})