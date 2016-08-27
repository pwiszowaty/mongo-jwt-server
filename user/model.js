const crypt = require('bcrypt-node');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
  hash: String
});

UserSchema.methods.setPassword = function(password){
	console.log('hashing: ' + password);
  this.hash = crypt.hashSync(password);
};

UserSchema.methods.validatePassword = function(password){
  return crypt.compareSync(password, this.hash);
};

UserSchema.pre('save', function(next){
	console.log('generating hash');
	if(!this.hash)
		this.hash = crypt.hashSync( (+new Date).toString(36).slice(-8) );
	next();
});

UserSchema.methods.generateJwt = function() {
	const expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),
	}, process.env.BD_TOKEN);
};

module.exports = mongoose.model('User', UserSchema);