const bcrypt = require('bcryptjs');

// Models
const Admin = require('../models/Admin');
const Painting = require('../models/Painting');

// Helpers
const sendAdminVerificationCode = require('../helpers/send-admin-verification-code');

let appVerificationCode = undefined; // Código de verificação do novo usuário atual

module.exports = class AdminController {

    static async showMainManagementPage(req, res) {

        const paintingsData = await Painting.findAll({
            order: [['createdAt', 'ASC']]
        });

        const paintings = paintingsData.map((paint) => {
            return paint.get({ plain: true })
        });
        
        res.render('admin/management', {paintings});

    }

    static async login(req, res) {

        res.render('admin/login');

    }

    static async loginPost(req, res) {

        const {email, password} = req.body;
 
        const admin = await Admin.findOne({where: {email: email}}); // Encontra usuário

        if(!admin) {
            req.flash('message', 'Usuário não encontrado!');
            res.render('admin/login');
            return;
        }
        
        const passwordMatch = bcrypt.compareSync(password, admin.password); // Verifica se a senha confere

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!');
            res.render('admin/login');
            return;
        }

        req.session.adminid = admin.id; // Inicia a sessão

        req.flash('message', 'Autenticação realizada com sucesso!');

        req.session.save(() => {
            res.redirect('/admin/management');
        }); 

    }

    static async register(req, res) {

        appVerificationCode = await sendAdminVerificationCode(req);
        req.flash('message', 'O código de verificação foi enviado para o e-mail do administrador');
        res.render('admin/register');

    }

    static async registerPost(req, res) {

        const {email, password} = req.body;
        const userVerificationCode = Number(req.body.userVerificationCode);

        // Verifica se o usuário digitou o código de verificação correto
        if (userVerificationCode === appVerificationCode) {

            // Criptografa a senha
            const salt = bcrypt.genSaltSync(10); 
            const hashedPassword = bcrypt.hashSync(password, salt);

            const admin = {
                email,
                password: hashedPassword
            };

            try {

                const createdAdmin = await Admin.create(admin);
                req.session.adminid = createdAdmin.id; // Inicia a sessão
                req.flash('message', 'Novo administrador cadastrado com sucesso!');

                req.session.save(( ) => {
                    res.redirect('/admin/management');
                })

            } catch (error) {

                req.flash('message', 'O código de verificação foi enviado para o e-mail do administrador');
                res.render('admin/register');

            }

        } else {

            req.flash('message', 'Erro ao criar novo administrador, tente mais tarde!');
            res.render('admin/register');
            return;

        }

    }

    static async logout(req, res) {

        req.session.destroy();
        res.redirect('login');

    }
    
}