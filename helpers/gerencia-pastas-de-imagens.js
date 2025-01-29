const fs = require('fs');
const path = require('path');

async function organizar_pastas_de_imagens(pastaDoItem) {

    const temp = `public/img/paintings/temp`; // Diretório temporário das imagens

    async function excluiArquivosDaPasta(caminho) {
        await fs.readdir(caminho, (err, arquivos) => {

            // Verifica se a pasta existe
            if (err) {
                console.error('Erro ao ler a pasta:', err);
                return;
            }


            arquivos.forEach((arquivo) => {
                const caminhoArquivo = path.join(caminho, arquivo);

                // Remove apenas arquivos, verificando se não é um diretório
                fs.stat(caminhoArquivo, (err, stats) => {
                    if (err) {
                        console.error('Erro ao obter informações do arquivo:', err);
                        return;
                    }

                    if (stats.isFile()) {
                        fs.unlink(caminhoArquivo, (err) => {
                            if (err) {
                                console.error('Erro ao deletar o arquivo:', err);
                            } else {
                                console.log(`Arquivo deletado: ${caminhoArquivo}`);
                            }
                        });
                    }
                });
            });
        });
    }

    async function moverArquivos(pastaOrigem, pastaDestino) {
        fs.readdir(pastaOrigem, (err, arquivos) => {
            if (err) {
                return console.error(`Erro ao ler a pasta de origem: ${err.message}`);
            }

            arquivos.forEach((arquivo) => {
                const origem = path.join(pastaOrigem, arquivo);
                const destino = path.join(pastaDestino, arquivo);

                fs.rename(origem, destino, (err) => {
                    if (err) {
                        console.error(`Erro ao mover o arquivo ${arquivo}: ${err.message}`);
                    } else {
                        console.log(`Arquivo movido: ${origem} -> ${destino}`);
                    }
                });
            });
        });
    }

    if (!fs.existsSync(pastaDoItem)) { // Verifica se a pasta do arquivo ainda não existe
        fs.mkdirSync(pastaDoItem);
    } else {    // Se a pasta já existir remove todo o seu conteúdo
        excluiArquivosDaPasta(pastaDoItem); // Exclui todos os arquivos da pasta enviada como parâmetro
    }

    moverArquivos(temp, pastaDoItem); // Move as imagens do arquivo da pasta temp para sua respectiva pasta

}

module.exports = organizar_pastas_de_imagens;