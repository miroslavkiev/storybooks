const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Load user model
require('./models/User');

//Passport config
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');
const index = require('./routes/index');

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

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
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

//Use routes
app.use('/auth', auth);
app.use('/', index);

const port = process.env.PORT || 80;

app.listen(port, () => {
	console.log(`App started on port ${port}`);
});