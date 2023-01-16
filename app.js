const dotenv = require('dotenv').config('../.env');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cors = require('cors');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();
app.use(cors());

const { DB_USER, DB_PASSWORD, DB_CLUSTER_NAME } = process.env;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_NAME}.mongodb.net/?retryWrites=true&w=majority`)
	.then(() => console.log('successful connection to MongoDB !'))
	.catch(() => console.log('connection failed to MongoDB !'));


const limiter = rateLimit ({
	windowMs: 10 * 60 * 100,
	max: 100,

	message: 'Try again in 15 minutes',
});
app.use(limiter);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));


app.use('/api/sauces',stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
