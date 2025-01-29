const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Address = require('../models/Address');

module.exports = class UserController {

    static async login(req, res) {
        res.render('users/login');
    }

    static async loginPost(req, res) {
        const {email, password} = req.body;
 
        const user = await User.findOne({where: {email: email}}); // Recupera o usuário

        if(!user) {
            req.flash('message', 'Usuário não encontrado!');
            res.redirect('/user/login');
            return;
        }
 
        const passwordMatch = bcrypt.compareSync(password, user.password); // Verifica se a senha enviada é a correta

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!');
            res.redirect('/user/login');
            return;
        }

        req.session.userid = user.id; // Inicia a sessão

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
            fullName,
            phoneNumber,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            zipCode } = req.body;

        // Validação de correspondência de senha
        if (password != confirmPassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!');
            res.render('users/register');
            return;
        }

        // Verifique se já existe um usuário com o e-mail enviado
        const checkIfUserExists = await User.findOne({ where: { email: email } });
        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!');
            res.render('users/register');
            return;
        }

        // Criptografa a senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            email,
            password: hashedPassword,
            fullName,
            phoneNumber
        }

        try {
            // Cadastra o usuário na tabela user, depois cadastra o endereço com o id do usuário criado como foreign key 
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
                    };

                    Address.create(address);

                    // initialize session
                    req.session.userid = user.dataValues.id;

                    req.flash('message', 'Cadastro realizado com sucesso!')
                    req.session.save(() => {
                        res.redirect("/");
                    })
                })
        } catch (error) {
            req.flash('message', 'Erro ao cadastrar usuário, por favor tente mais tarde');
            res.redirect('/');
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