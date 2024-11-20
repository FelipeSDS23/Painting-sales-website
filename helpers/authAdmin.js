module.exports.checkAuthAdmin = function (req, res, next) {
    const adminId = req.session.adminid

    if(!adminId) {
        res.redirect('/admin/login')
    }

    next()
}