const fs = require('fs');
const path = require('path');

// Models
const Painting = require('../models/Painting');

// Helpers
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

        // Cria uma chave em cada item de painting, o valor da chave é um array com o nome das imagens da painting
        paintings.forEach(item => {
            item.imgArray = imgArray[`${item.id}`];
            item.cover = imgArray[`${item.id}`][0];
        });

        res.render('paintings/dashboard', { paintings });

    }

    static async paintingRegister(req, res) {

        const { name, description, height, width, frameType, price } = req.body;

        const AdminId = req.session.adminid;

        const painting = {
            name,
            description,
            height,
            width,
            frameType,
            price,
            AdminId
        };

        try {
            await Painting.create(painting).then((painting) => {
                // Move as imagens da pasta temp para uma pasta com o nome da pintura
                const pastaDoItem = `public/img/paintings/${painting.dataValues.id}`;
                organizar_pastas_de_imagens(pastaDoItem);
            });
            req.flash('message', 'Cadastro realizado com sucesso!');
            res.redirect('/admin/management');
        } catch (error) {
            req.flash('message', 'Erro ao cadastrar, por favor tente mais tarde!');
            res.redirect('/admin/management');
        }

    }

    static async paintingDelete(req, res) {

        const _id = req.params.id;

        const painting = await Painting.findOne({
            where: { id: _id }
        });

        if (!painting) {
            res.redirect(res.render('admin/management'));
            return;
        }

        await Painting.destroy({
            where: { id: _id }
        });

        // Recupera o caminho da pasta com as imagens da pintura
        const paintId = painting.id;
        const filePath = `public/img/paintings/${paintId}`;

        // Exclui a pasta com as imagens da pintura
        fs.rm(filePath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Erro ao remover a pasta:', err);
            } else {
                console.log('Pasta removida com sucesso!');
            }
        });

        req.flash('message', 'Exclusão realizada com sucesso!');
        res.redirect('/admin/management');
    }

    static async paintingUpdateGet(req, res) {

        const _id = req.params.id;

        const painting = await Painting.findOne({
            where: { id: _id },
            raw: true
        });

        res.render('paintings/update', { painting });

    }

    static async paintingUpdatePost(req, res) {

        const { id, name, description, height, width, frameType, price } = req.body;

        // Se na atualização o usuário enviar novas imagens, substitui as antigas
        if (req.files != []) {
            let pastaDoItem = `public/img/paintings/${id}`;
            organizar_pastas_de_imagens(pastaDoItem);
        }

        const painting = {
            name,
            description,
            height,
            width,
            frameType,
            price
        };

        await Painting.update(painting, { where: { id: id } });

        req.flash('message', 'Registro atualizado com sucesso!');
        res.redirect('/admin/management');
    }

    static async paintingDetails(req, res) {

        const _id = req.params.id

        const painting = await Painting.findOne({
            where: { id: _id },
            raw: true
        });

        // Adiciona ao objeto painting um uma chave "imgArray", seu valor é um array com o caminho de cada imagem referente a pintura 
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
        let imgArray = listarArquivos(`public/img/paintings/${painting.id}`);
        let imgArrayPaths = imgArray.map(item => `/img/paintings/${painting.id}/${item}`);
        painting.imgArray = imgArrayPaths;

        res.render("paintings/details", { painting });
    }

    static async cart(req, res) {
        res.render('paintings/cart');
    }

    static async cartPost(req, res) {

        // Recupera o id de cada pintura que está no carrinho
        const idsString = req.body.ids;
        const idsArray = idsString.split(",");

        // Verifica se as pinturas existem
        const paintings = await Painting.findAll({
            where: { id: idsArray },
            raw: true
        });

        // Envia os dados das pinturas para o gateway de pagamento
        gerar_link_de_pagamento(res, paintings);

    }
}