const config = require("../config/unittests");
const should = require("chai").should();
const expect = require("chai").expect;
const sinon = require("sinon");
const Model = require("./model");
const util = require("util");
const Ctrl = require("./controller");
const req = {};
const res = {
	json: sinon.stub(),
	status: sinon.stub()
};

sinon.stub(Model.prototype, 'setPassword');
sinon.stub(Model.prototype, 'generateJwt');

const save = sinon.stub(Model.prototype, 'save');
save.yields(null, new Model());

describe("Controller - User", function(){		
	it("can register async", function(done){
		const pass = "sample_pass";
		req.body = {
			name: "Test Name", 
			email: "test@test.com",
			password: pass
		};
		
		ctrl = new Ctrl();
		ctrl.register(req, res);
		
		process.nextTick(function () {
			expect(res.status.calledWithExactly(200)).to.be.ok;
			expect(Model.prototype.setPassword.calledOnce).to.be.ok;
			expect(Model.prototype.setPassword.calledWithExactly(pass)).to.be.ok;
			
			expect(Model.prototype.save.calledOnce).to.be.ok;			
			expect(Model.prototype.generateJwt.calledWithExactly()).to.be.ok;
			
			//save callback
			expect(res.json.callCount).to.be.ok;		
			done();
		});
	});

//TODO: can't register with empty data
//TODO: can't register with same data

});