const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

module.exports = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Middleware to log incoming requests
    app.use(morgan('dev'));


    app.use(function (req, res, next) {
        let allowedOrigins = [];
        let origin = req.headers.origin;
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "POST, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-forwarded-for");
        res.setHeader("Access-Control-Expose-Headers", 'Access-Token');
        next();
    });

    require('../app/routes/index.route')(app);

    return app;
}