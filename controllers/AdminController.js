

module.exports = class AdminController {
    static async showMainManagementPage(req, res) {

        res.render('admin/management')

    }

    static async login(req, res) {

        res.render('admin/login')

    }

    static async makeAdministratorLogin(req, res) {

        console.log(req.body.email)
        console.log(req.body.password)

    }
}