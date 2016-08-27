const User = require('./model');
const util = require('util');

function UserController(){}

UserController.prototype.register = function(req, res){
	if(!req.body.name || !req.body.email) {
		res.status(400).json({
			message: "Invalid data"
		});
		return;
	}
	
	const user = new User({
		email: req.body.email,
		name: req.body.name
	});

	user.setPassword(req.body.pass);

	user.save(function(err, user){
		if(err) {
			res.status(400).json({
				message: "Could not register",
				error: err.errmsg
			});
			
			return;
		}
		
		res.status(200).json({
			message: "Successfully registered.",
			token: user.generateJwt()
		}); 
	});
};

UserController.prototype.login = function(req, res){
	if(!req.body.pass || !req.body.email) {
		res.status(401);
		res.json({
			message: "Incorrect credentials.",  
			request: req.body 
		});
		
		return false;	
	}
	
	User.findOne({
		email: req.body.email
	}, function(err, user){
		if(!err && user && user.validatePassword(req.body.pass)) {
			res.status(200).json({
				message: "Successfully logged in.",
				token: user.generateJwt()
			});	
			
			return true;
		}
		
		res.status(401).json({
			message: "Incorrect credentials.",
			request: req.body  
		});

	});
};

UserController.prototype.update = function(req, res){
	res.status(200);

	console.log('trying to update user: ' + req.user.email);

	User.update({
		email: req.user.email,
	}, req.body, {}, function callback(err, numAffected){
		
		User.findOne({
			email: req.body.email
		}, function updateCallback(err, user){
			
			console.log('I think I made it! ');
			
			res.json({
				message: "Successfully updated.",
				err: err,
				num: numAffected,
				token: user.generateJwt()
			});
		}); 
	});
};

UserController.prototype.remove = function(req, res){
	if(!req.email) {
		res.status(401).json({
			request: req.body
		});
		return;
	}
			
	res.status(200);
			
	User.find({ "email": req.email }).remove(function(err, user){
		res.json({
			message: "Successfully deleted." 
		});
	});
};

UserController.prototype.profile = function(req, res){
	res.status(200).json({
		user:{
			name: req.name, 
			email: req.email, 
			id: req._id	
		}
	});
};

UserController.prototype.list = function list(req, res){
	res.status(200);
	
	User.find(function find_callback(err, users) {	
		res.json({
			users: users, 
			err: err 
		});
	});
};

module.exports = UserController;