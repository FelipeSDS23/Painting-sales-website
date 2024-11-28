const sendAdminVerificationCode = require('../helpers/send-admin-verification-code');
const Admin = require('../models/Admin');
const Painting = require('../models/Painting');
const bcrypt = require('bcryptjs');

let appVerificationCode = undefined; // current new user verification code

module.exports = class AdminController {

    static async showMainManagementPage(req, res) {

        const paintingsData = await Painting.findAll({
            order: [['createdAt', 'ASC']]
        })

        const paintings = paintingsData.map((paint) => {
            return paint.get({ plain: true })
        })

        let paintingsQty = paintings.length

        if (paintingsQty === 0) {
            paintingsQty = false
        }


        console.log(paintings)

        const session = req.session;
        res.render('admin/management', {session, paintings});

    }

    static async login(req, res) {

        res.render('admin/login');

    }

    static async loginPost(req, res) {

        const {email, password} = req.body;
 
        const admin = await Admin.findOne({where: {email: email}}); // find user

        if(!admin) {
            req.flash('message', 'Usuário não encontrado!');
            res.render('admin/login');
            return;
        }
        
        const passwordMatch = bcrypt.compareSync(password, admin.password); // check if password match

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!');
            res.render('admin/login');
            return;
        }

        req.session.adminid = admin.id; // initialize session

        req.flash('message', 'Autenticação realizada com sucesso!');

        req.session.save(() => {
            res.redirect('/admin/management');
        }); 

    }

    static async register(req, res) {

        appVerificationCode = await sendAdminVerificationCode(req);
        res.render('admin/register');

    }

    static async registerPost(req, res) {

        const email = req.body.email;
        const password = req.body.password;
        const userVerificationCode = Number(req.body.userVerificationCode);

        if (userVerificationCode === appVerificationCode) {

            const salt = bcrypt.genSaltSync(10); // create a password
            const hashedPassword = bcrypt.hashSync(password, salt); // create a password

            const admin = {
                email,
                password: hashedPassword
            }

            try {

                const createdAdmin = await Admin.create(admin);
                req.session.adminid = createdAdmin.id; // initialize session
                req.flash('message', 'Novo administrador cadastrado com sucesso!');

                req.session.save(( ) => {
                    res.redirect('/admin/management');
                })

            } catch (error) {

                console.log(error);

            }

        } else {

            req.flash('message', 'Código de verificação inválido!');
            res.render('admin/register');
            return;

        }

    }

    static async logout(req, res) {

        req.session.destroy();
        res.redirect('login');

    }
    
}