const express = require('express');
const mongoose = require('mongoose');
const InitiateMongoServer = require("./server/config/dbconfig.js");
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser')

InitiateMongoServer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);

require('dotenv').config();

require('./server/routes/routesList')(app);

app.listen(port, () => console.log(`Listening on port ${port}`));


