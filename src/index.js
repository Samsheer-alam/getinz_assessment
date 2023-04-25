const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Parse JSON
app.use(express.json());

// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
console.log(MONGODB_URL)
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB is running ... \n");
}).catch(err => {
    console.error("DB starting error:", err.message);
    process.exit(1);
});

// Use the user routes
app.use(require('./routes'));

// If api route does not exist
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(err.status).json({ type: 'error', message: 'the url you are trying to reach is not hosted on our server' });
    next(err);
});

// Starts the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});