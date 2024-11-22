module.exports.checkAuthAdmin = function (req, res, next) {
    const adminId = req.session.adminid

    // console.log(req.session)

    if(!adminId) {
        res.redirect('/admin/login')
        return
    }

    next()
}