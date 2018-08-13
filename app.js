const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//Passport config
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');

const app = express();

app.get('/', (req, res) => {
	res.send('It works');
});

//Use routes
app.use('/auth', auth);

const port = process.env.PORT || 80;

app.listen(port, () => {
	console.log(`App started on port ${port}`);
});