const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const { JSDOM } = require("jsdom");

// Load helpers
const {truncate, stripTags, formatDate} = require('./helpers/hbs');

//Load models
require('./models/User');
require('./models/Story');

//Passport config
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//Load keys
const keys = require('./config/keys');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose connect
mongoose.connect(keys.mongoURI, {
	useNewUrlParser:true
})
	.then(() => console.log('MongoDb connected'))
	.catch(err => console.log(err));

const app = express();

//Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handlebars middleware
app.engine('handlebars', exphbs({
	helpers: {
		truncate: truncate,
		stripTags: stripTags,
		formatDate: formatDate
	},
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Cookie parser middleware
app.use(cookieParser());

//express-session middleware
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Use routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

const port = process.env.PORT || 80;

app.listen(port, () => {
	console.log(`App started on port ${port}`);
});