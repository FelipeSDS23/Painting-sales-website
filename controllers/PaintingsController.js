const Painting = require('../models/Painting');

module.exports = class PaintingsController {

    static async showAllPaintings(req, res) {

        const paintingsData = await Painting.findAll({
            order: [['createdAt', 'DESC']]
        });

        const paintings = paintingsData.map((result) => {
            return result.get({ plain: true });
        });

        res.render('paintings/dashboard', {paintings});

    }

    static async paintingRegister(req, res) {

        const {name, description, height, width, frameType, price} = req.body;
        const AdminId = req.session.adminid;

        let image = '';
        if(req.file) {
            image = req.file.filename;
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
        };

        try {

            await Painting.create(painting);
            req.flash('message', 'Cadastro realizado com sucesso!');
            const session = req.session;
            res.render('admin/management', {session});

        } catch (error) {

            req.flash('message', 'Erro ao cadastrar, por favor tente mais tarde!');
            const session = req.session;
            res.render('admin/management', {session});
            
        }
        
    }


}