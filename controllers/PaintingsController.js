

module.exports = class PaintingsController {
    static async showAllPaintings(req, res) {

        res.render('paintings/dashboard')

    }
}