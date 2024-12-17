// const sendAdminVerificationCode = require('../helpers/send-admin-verification-code');
// const Admin = require('../models/Admin');
// const Painting = require('../models/Painting');
const bcrypt = require('bcryptjs');

// let appVerificationCode = undefined; // current new user verification code

module.exports = class UserController {

    static async login(req, res) {
        res.render('users/login');
    }

    static async register(req, res) {
        res.render('users/register');
    }
    
}