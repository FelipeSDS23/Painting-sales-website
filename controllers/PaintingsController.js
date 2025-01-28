const fs = require('fs');
const Painting = require('../models/Painting');
const path = require('path');

// helpers
const gerar_link_de_pagamento = require("../helpers/api-mercado-pago");
const organizar_pastas_de_imagens = require("../helpers/gerencia-pastas-de-imagens");

module.exports = class PaintingsController {

    static async showAllPaintings(req, res) {

        const paintingsData = await Painting.findAll({
            order: [['createdAt', 'DESC']]
        });

        let paintings = paintingsData.map((result) => {
            return result.get({ plain: true });
        });

        const userid = req.session.userid;




        function listarArquivosPorPasta(pastaMae) {
            const resultado = {};

            // Lê todas as pastas e arquivos dentro da pasta mãe
            const pastasFilhas = fs.readdirSync(pastaMae).filter(item => {
                const caminhoItem = path.join(pastaMae, item);
                return fs.statSync(caminhoItem).isDirectory(); // Filtra apenas pastas
            });

            // Para cada pasta filha, lista seus arquivos
            pastasFilhas.forEach(pasta => {
                const caminhoPasta = path.join(pastaMae, pasta);
                const arquivos = fs.readdirSync(caminhoPasta).filter(item => {
                    const caminhoItem = path.join(caminhoPasta, item);
                    return fs.statSync(caminhoItem).isFile(); // Filtra apenas arquivos
                });

                resultado[pasta] = arquivos;
            });

            return resultado;
        }

        let imgArray = listarArquivosPorPasta('public/img/paintings');

        //cria uma chave em cada item de painting com um array com o nome das suas imagens
        paintings.forEach(item => {
            item.imgArray = imgArray[`${item.name}`];
            item.cover = imgArray[`${item.name}`][0];
        });






        res.render('paintings/dashboard', { paintings, userid });

    }

    static async paintingRegister(req, res) {

        const { name, description, height, width, frameType, price } = req.body;
        const AdminId = req.session.adminid;

        let image = '';
        // if(req.file) {
        //     image = req.file.filename;
        // }

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


        let pastaDoItem = `public/img/paintings/${name}`;
        organizar_pastas_de_imagens(pastaDoItem);


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
            where: { id: _id }
        });

        if (!painting) {
            res.redirect(res.render('admin/management'))
            return
        }

        const imgName = painting.name

        await Painting.destroy({
            where: { id: _id }
        })

        const filePath = `public/img/paintings/${imgName}`;

        console.log("***********")
        console.log(filePath)

        fs.rm(filePath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Erro ao remover a pasta:', err);
            } else {
                console.log('Pasta removida com sucesso!');
            }
        });

        req.flash('message', 'Exclusão realizada com sucesso!')

        res.redirect('/admin/management')
    }

    static async paintingUpdateGet(req, res) {

        const _id = req.params.id

        const painting = await Painting.findOne({
            where: { id: _id },
            raw: true
        });

        res.render('paintings/update', { painting })

    }

    static async paintingUpdatePost(req, res) {

        const { id, name, description, height, width, frameType, price } = req.body


        let image = '';

        if (req.files) {
            let pastaDoItem = `public/img/paintings/${name}`;
            organizar_pastas_de_imagens(pastaDoItem);
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

        await Painting.update(painting, { where: { id: id } })

        req.flash('message', 'Registro atualizado com sucesso!')

        res.redirect('/admin/management');
    }

    static async paintingDetails(req, res) {

        const _id = req.params.id

        const painting = await Painting.findOne({
            where: { id: _id },
            raw: true
        });





        function listarArquivos(pasta) {
            try {
                // Lê o conteúdo da pasta
                const arquivos = fs.readdirSync(pasta);

                // Filtra apenas os arquivos (não pastas)
                const arquivosFiltrados = arquivos.filter(arquivo => fs.lstatSync(path.join(pasta, arquivo)).isFile());

                return arquivosFiltrados;
            } catch (error) {
                console.error("Erro ao ler a pasta:", error);
                return [];
            }
        }

        let imgArray = listarArquivos(`public/img/paintings/${painting.name}`);
        let imgArrayPaths = imgArray.map(item => `/img/paintings/${painting.name}/${item}`);

        painting.imgArray = imgArrayPaths;







        res.render("paintings/details", { painting })

    }

    static async cart(req, res) {
        res.render('paintings/cart');
    }

    static async cartPost(req, res) {

        const idsString = req.body.ids;
        const idsArray = idsString.split(",");


        const paintings = await Painting.findAll({
            where: { id: idsArray },
            raw: true
        });

        // console.log(paintings)
        gerar_link_de_pagamento(res, paintings);

    }
}