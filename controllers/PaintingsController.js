const fs = require('fs');
const Painting = require('../models/Painting');

const gerar_link_de_pagamento = require("../helpers/api-mercado-pago");

module.exports = class PaintingsController {

    static async showAllPaintings(req, res) {

        const paintingsData = await Painting.findAll({
            order: [['createdAt', 'DESC']]
        });

        const paintings = paintingsData.map((result) => {
            return result.get({ plain: true });
        });

        const userid = req.session.userid


        res.render('paintings/dashboard', {paintings, userid});

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
            res.redirect('/admin/management');

        } catch (error) {

            req.flash('message', 'Erro ao cadastrar, por favor tente mais tarde!');
            const session = req.session;
            res.redirect('/admin/management');
            
        }
        
    }

    static async paintingDelete(req, res) {

        const _id = req.params.id

        const painting = await Painting.findOne({
            where: {id: _id}
        });

        if(!painting) {
            res.redirect(res.render('admin/management'))
            return
        }

        const imgName = painting.toJSON().image

        await Painting.destroy({
            where: {id: _id}
        })

        const filePath = `public/img/paintings/${imgName}`;

        fs.unlink(filePath, (erro) => {
            if (erro) {
              console.error('Erro ao deletar o arquivo:', erro);
            } else {
              console.log('Arquivo deletado com sucesso!');
            }
        });
        
        req.flash('message', 'Exclusão realizada com sucesso!')

        res.redirect('/admin/management')
    }

    static async paintingUpdateGet(req, res) {

        const _id = req.params.id

        const painting = await Painting.findOne({
            where: {id: _id},
            raw: true
        }); 

        res.render('paintings/update', {painting})
        
    }

    static async paintingUpdatePost(req, res) {

        const {id, name, description, height, width, frameType, price} = req.body

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
            image
        }

        await Painting.update(painting, {where: {id: id}})

        req.flash('message', 'Registro atualizado com sucesso!')

        res.redirect('/admin/management');
    }

    static async paintingDetails(req, res) {

        const _id = req.params.id

        const painting = await Painting.findOne({
            where: {id: _id},
            raw: true
        }); 

        console.log(painting)

        res.render("paintings/details", {painting})

    }

    static async cart(req, res) {
        res.render('paintings/cart');
    }

    static async cartPost(req, res) {

        const idsString = req.body.ids;
        const idsArray = idsString.split(",");

  
        const paintings = await Painting.findAll({
            where: {id: idsArray},
            raw: true
        }); 
    
        // console.log(paintings)
        gerar_link_de_pagamento(res, paintings);

    }
}