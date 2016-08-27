const config = require("../config/unittests");
const should = require("chai").should();
const expect = require("chai").expect;
const mongoose = require("mongoose");
const Model = require("./model");
const util = require("util");
const clearDB = require("mocha-mongoose")(config.db, {
	noClear: true
});

describe("User", function(){
	before(function(done){
		clearDB(done);
	});
	
	after(function(done){
		clearDB(done);
	});
	
	beforeEach(function(done){
		if(mongoose.connection.db)
			return done();
			
		mongoose.connect(config.db, done);
	});
	
	it("can be saved", function(done){
		new Model({
			email: "test@test.com", 
			name: "Test Name"
		}).save(done);
	});	
	
	it("will have at least randomly generated password", function(done){
		Model.findOne({
			email: "test@test.com"
		}, function(err, user){
			if(err)
				return done(err);
					
			user.hash.should.be.ok;
			done();
		})
	});
	
	it("can't be saved without name", function(done){
		new Model({
			email: "noname@test.com", 
		}).save(function(err, res){
			should.exist(err);
			return done();
		});
	});
	
	it("can't be saved without email", function(done){
		new Model({
			name: "No Email", 
		}).save(function(err, res){
			should.exist(err);
			return done();
		});
	});	
	
	it("can't duplicate accounts", function(done){
		new Model({
			email: "test@test.com", 
			name: "Test2 Name" 
		}).save(function(err, res){
			should.exist(err);
			return done();
		});
	});	
	
	it('password hashing has to work', function(done){
		const pass = 'not_hashed_passowrd';
		const user = new Model({
			email: "hash@test.com", 
			name: "Hash Name"
		});
		
		user.setPassword(pass);
		
		expect(user.hash).to.not.equal(pass);
		done();
	});
	
	it("can be listed", function(done){
		Model.find({}, function(err, docs){
			if(err)
				return done(err);
					
			docs.length.should.equal(1);
			done();
		})
	});
	
});