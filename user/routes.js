const express = require('express');
const router = express.Router();
const passport = require('passport');
const Controller = require('./controller');
const controller = new Controller();

//public routes
router.post('/register', controller.register);
router.post('/login', controller.login);

//for logged in users
router.post('/delete', passport.authenticate('jwt', { session: false }), controller.remove);
router.get('/profile', passport.authenticate('jwt', { session: false }), controller.profile);
router.post('/update', passport.authenticate('jwt', { session: false }), controller.update);

//for admins
router.get('/list', controller.list);

module.exports = router;