
'use strict';
const bodyParser = require('body-parser'),
 	  express = require("express"),
	  app = express(),
	  mongoose = require('mongoose'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local'),
	  Campground = require('./models/campground'),
	  Comment = require('./models/comment'),
	  User = require('./models/user'),
	  seedDB = require('./seeds');

	  
//create database
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
const port = app.get('port');

//Seed data
seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Once again',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.get('/' , (req, res, next) => {
	res.render("landing");
});

//INDEX - show all campgrounds
app.get('/campgrounds', (req, res, next) => {
	// res.render('campgrounds', {campgrounds: campgrounds});
	Campground.find({}, (error, allCampgrounds) => {
		if(error){
			console.log(error);
		} else {
			res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

//NEW - show form to create a campground
app.get('/campgrounds/new', (req, res, next) => {
	res.render('campgrounds/new');
});

//SHOW - shows more info about one campground
app.get('/campgrounds/:id', (req, res, next) => {
	//find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec((error, foundCampground) => {
		if(error){
			console.log(error);
		} else {
			// console.log(`hello  ${foundCampground}`);
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

//CREATE - add new campground to DB
app.post('/campgrounds', (req, res, next) => {
	//get data from the form and add  to campground array
	let name = req.body.name,
	    image = req.body.image,
	    description = req.body.description,
	    newCampground = {name:name , image: image, description: description};
	//create a new campground and save it to the DB
	Campground.create(newCampground, (error, newlyCreated) => {
		if(error){
			console.log(error);
		} else {
			//redirect back to the campground route
			res.redirect('/campgrounds');
		}
	});

})

// --------------------- Comments Route ---------------------------

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res, next) => {
	//find campground by ID
	Campground.findById(req.params.id, (error, campground) => {
		if(error){
			console.log(error);
		} else {
			res.render('comments/new', {campground: campground})
		}
	})
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res, next) => {
	//lookup campgorund using ID
	Campground.findById(req.params.id, (error, campground) => {
		if (error){
			console.log('error');
			res.redirect('/campground')
		} else {
			//create new commen
			Comment.create(req.body.comment, (error, comment) =>{
				if(error){
					console.log(error);
				} else {
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					//redirect to show page
					res.redirect(`/campgrounds/${campground._id}`);
				}
			})
		}
	});
})


//AUTH ROUTES
app.get('/register', (req, res) => {
	res.render('register');
});

//handle sign up logic
app.post('/register', (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (error, user) => {
		if(error){
			console.log(error);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds');
		});
	});
});

//Show login form
app.get('/login', (req,res) => {
	res.render('login');
});

app.post('/login', passport.authenticate('local', 
{
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}), (req, res) => {	
});

//Logout ROute
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


app.listen(port, () => {
	console.log('Server running on port: ', port);
});