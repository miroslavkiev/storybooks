const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const { JSDOM } = require("jsdom");
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
	res.render('index/welcome');
});

router.get('/about', (req, res) => {
	res.render('index/about');
});

router.get('/test', (req, res) => {
	request(req.query.url, function (error, response, body) {
		const dom = new JSDOM(body);
		const vacancy = dom.window.document.querySelector(".card.wordwrap").textContent;
		let technologies = {};
	});
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
	res.render('index/dashboard');
});

module.exports = router;