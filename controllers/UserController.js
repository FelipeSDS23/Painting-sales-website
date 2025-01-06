// const sendAdminVerificationCode = require('../helpers/send-admin-verification-code');
const User = require('../models/User');
const Address = require('../models/Address');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// let appVerificationCode = undefined; // current new user verification code

module.exports = class UserController {

    static async login(req, res) {
        res.render('users/login');
    }

    static async loginPost(req, res) {
        const {email, password} = req.body;
 
        const user = await User.findOne({where: {email: email}}); // find user

        if(!user) {
            req.flash('message', 'Usuário não encontrado!');
            res.redirect('/user/login');
            return;
        }
 
        const passwordMatch = bcrypt.compareSync(password, user.password); // check if password match

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!');
            res.redirect('/user/login');
            return;
        }

        req.session.userid = user.id; // initialize session

        req.flash('message', 'Autenticação realizada com sucesso!');

        req.session.save(() => {
            res.redirect('/');
        }); 
    }

    static async register(req, res) {
        res.render('users/register');
    }

    static async registerPost(req, res) {

        const { email,
            password,
            confirmPassword,
            userVerificationCode,
            fullName,
            phoneNumber,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            zipCode } = req.body;

        // password match validation
        if (password != confirmPassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('users/register')
            return
        }

        // check if user exists
        const checkIfUserExists = await User.findOne({ where: { email: email } })
        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!')
            res.render('users/register')
            return
        }


        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            email,
            password: hashedPassword,
            fullName,
            phoneNumber
        }

        try {
            await User.create(user)
                .then((user) => {

                    const address = {
                        street,
                        number,
                        complement,
                        neighborhood,
                        city,
                        state,
                        zipCode,
                        UserId: user.dataValues.id
                    }

                    Address.create(address)

                    // initialize session
                    req.session.userid = user.dataValues.id
                    req.session.userid = 12;

                    req.flash('message', 'Cadastro realizado com sucesso!')

                    req.session.save(() => {
                        res.redirect("/");
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    static async logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    static async termosDeUso(req, res) {
        res.render('users/termos');
    }

}