const Painting = require('../models/Painting')

module.exports = class PaintingsController {
    static async showAllPaintings(req, res) {

        const paintingsData = await Painting.findAll({
            order: [['createdAt', 'DESC']]
        })

        const paintings = paintingsData.map((result) => {
            return result.get({ plain: true })
        })

        console.log(paintings)

        res.render('paintings/dashboard', {paintings})

    }
}