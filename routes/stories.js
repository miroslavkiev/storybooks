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
		.sort({date: 'desc'})
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

router.get('/show/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
		.populate('user')
		.populate('comments.commentUser')
		.then(story => {
			if(story.status === 'public'){
			res.render('stories/show', {
				story: story
			});
			} else {
				if(req.user){
					if(req.user.id === story.user.id){
						res.render('stories/show', {
							story: story
						});
					} else {
						res.redirect('/stories');
					}
				} else {
					res.redirect('/stories');
				}
			}
		})
});

router.get('/edit/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
		.then(story => {
			if(story.user != req.user.id){
				res.redirect('/stories');
			} else{
				res.render('stories/edit', {
					story: story
				});
			}
		})
});

router.put('/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
		.then(story => {
			let allowComments;

			if (req.body.allowComments) {
				allowComments = true;
			} else {
				allowComments = false;
			}

			//New values
			story.title = req.body.title;
			story.body = req.body.body;
			story.status = req.body.status;
			story.allowComments = allowComments;

			story.save()
				.then(story => {
					res.redirect('/dashboard');
				});
		})
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
	Story.deleteOne({_id: req.params.id})
		.then(() => {
			res.redirect('/dashboard');
		})
});

router.post('/', ensureAuthenticated, (req, res) => {
	let allowComments;

	if (req.body.allowComments) {
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

router.post('/comment/:id', (req, res) => {
	Story.findOne({_id: req.params.id})
		.then(story => {
			const newComment = {
				commentBody: req.body.commentBody,
				commentUser: req.user.id
			}

			//Push to comments array
			story.comments.unshift(newComment);
			story.save()
				.then(story => {
					res.redirect(`/stories/show/${story.id}`);
				});
		});
});

router.get('/user/:userId', (req, res) => {
	Story.find({user: req.params.userId, status: 'public'})
		.populate('user')
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

router.get('/my', ensureAuthenticated, (req, res) => {
	Story.find({user: req.user.id})
		.populate('user')
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

module.exports = router;