const nodemailer = require('nodemailer')

const systemAdminEmail = 'felipe03san@gmail.com'

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para 465, false para outras
    auth: {
        user: 'felipe03san@gmail.com',
        pass: 'rcep etna xvad qujy'
    }
})

const generateVerificationCode = () => {
    let numeros = [];
    for (let i = 0; i < 6; i++) {
        let numeroAleatorio = Math.floor(Math.random() * 10); // Gera número de 0 a 9
        numeros.push(numeroAleatorio);
    }

    // Junta os elementos do array em uma única string
    let numerosNumber = numeros.join('');
    // Converte a string em um número
    numerosNumber = Number(numerosNumber);

    return numerosNumber;
}

const sendAdminVerificationCode = (req) => {

    const appVerificationCode = generateVerificationCode()

    transport.sendMail({
        from: 'Quadros e Pinturas <felipe03san@gmail.com>',
        to: `${systemAdminEmail}`,
        subject: 'Verificação de registro de usuário - Site Quadros e Pinturas',
        html: `<p>Um novo usuário está tentando se registrar como 
            administrador, para autenticar o registro insira o código de segurança:
            <strong>${appVerificationCode}</strong>
            </p>`
    })
    .then(() => {console.log('Email enviado com sucesso!')})
    .catch((error) => {console.log(`Erro ao enviar email: ${error}`)})

    return appVerificationCode
}

module.exports = sendAdminVerificationCode