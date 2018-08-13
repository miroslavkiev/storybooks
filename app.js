const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => {
	res.send('It works');
});

const port = process.env.PORT || 80;

app.listen(port, () => {
	console.log(`App started on port ${port}`);
});