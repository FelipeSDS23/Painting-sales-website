const { where } = require('sequelize')
const sendAdminVerificationCode = require('../helpers/send-admin-verification-code')

const Admin = require('../models/Admin')
const Painting = require('../models/Painting')

const bcrypt = require('bcryptjs')
const session = require('express-session')

// código para validação de registro de novos usuários administradores
let appVerificationCode = undefined

module.exports = class AdminController {
    static async showMainManagementPage(req, res) {

        console.log(req.session)
        
        const session = req.session

        res.render('admin/management', {session})
        // res.render('admin/management')

    }

    static async paintingRegister(req, res) {

        const {name, description, height, width, frameType, price} = req.body
        // console.log(name)
        // console.log(description)
        // console.log(height)
        // console.log(width)
        // console.log(frameType)
        // console.log(price)
        // console.log(image)

        const AdminId = req.session.adminid

        let image = ''
        if(req.file) {
            image = req.file.filename
        }

        const painting = {
            name,
            description,
            height, 
            width, 
            frameType, 
            price, 
            image,
            AdminId
        }

        try {

            await Painting.create(painting)
            
            req.flash('message', 'Cadastro realizado com sucesso!')

            const session = req.session
            res.render('admin/management', {session})

        } catch (error) {
            req.flash('message', 'Erro ao cadastrar, por favor tente mais tarde!')

            const session = req.session
            res.render('admin/management', {session})
        }
    }

    static async login(req, res) {

        res.render('admin/login')

    }

    static async loginPost(req, res) {

        const {email, password} = req.body
 
        // find user
        const admin = await Admin.findOne({where: {email: email}})

        if(!admin) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('admin/login')
            return
        }

        // check if password match
        const passwordMatch = bcrypt.compareSync(password, admin.password)

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('admin/login')
            return
        }

        // initialize session
        req.session.adminid = admin.id

        req.flash('message', 'Autenticação realizada com sucesso!')

        req.session.save(() => {
            res.redirect('/admin/management')
        }) 

    }

    static async register(req, res) {

        appVerificationCode = await sendAdminVerificationCode(req)

        // console.log(appVerificationCode)

        res.render('admin/register')

    }

    static async registerPost(req, res) {

        const email = req.body.email
        const password = req.body.password
        const userVerificationCode = Number(req.body.userVerificationCode)

        // console.log(email)
        // console.log(password)
        // console.log(userVerificationCode)
        // console.log(appVerificationCode)

        if (userVerificationCode === appVerificationCode) {

            // create a password
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(password, salt)

            const admin = {
                email,
                password: hashedPassword
            }

            try {
                const createdAdmin = await Admin.create(admin)

                // initialize session
                req.session.adminid = createdAdmin.id
    
                req.flash('message', 'Novo administrador cadastrado com sucesso!')
    
                req.session.save(( ) => {
                    res.redirect('/admin/management')
                })
            } catch (error) {
                console.log(error)
            }


            // console.log(`O usuário ${email} senha ${password} pode ser cadastrado!`)
        } else {
            req.flash('message', 'Código de verificação inválido!')
            res.render('admin/register')
            return
            // console.log(`Código de verificação inválido!`)
        }

    }

    static async logout(req, res) {
        console.log("foi")
        req.session.destroy()
        res.redirect('login')
    }
}