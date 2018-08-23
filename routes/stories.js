const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', (req, res) => {
	Story.find({status: 'public'})
		.populate('user')
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		})
});

router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});

router.get('/edit', ensureAuthenticated, (req, res) => {
	res.render('stories/edit');
});

router.get('/show', ensureAuthenticated, (req, res) => {
	res.render('stories/show');
});

router.post('/', ensureAuthenticated, (req, res) => {
	let allowComments;

	if(req.body.allowComments){
		allowComments = true;
	} else {
		allowComments = false;
	}

	//map fields
	const newStory = {
		title: req.body.title,
		status: req.body.status,
		allowComments: allowComments,
		body: req.body.body,
		user: req.user.id
	}

	//Create story
	new Story(newStory)
		.save()
		.then(story => {
			res.redirect(`/stories/show/${story.id}`);
		})
});

module.exports = router;