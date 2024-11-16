const sendAdminVerificationCode = require('../helpers/send-admin-verification-code')

// código para validação de registro de novos usuários administradores
let appVerificationCode = undefined

module.exports = class AdminController {
    static async showMainManagementPage(req, res) {

        res.render('admin/management')

    }

    static async login(req, res) {

        res.render('admin/login')

    }

    static async loginPost(req, res) {

        console.log(req.body.email)
        console.log(req.body.password)

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
            console.log(`O usuário ${email} senha ${password} pode ser cadastrado!`)
        } else {
            console.log(`O usuário ${email} senha ${password} NÃO pode ser cadastrado!`)
        }

    }
}