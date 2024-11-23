const nodemailer = require('nodemailer')

const systemAdminEmail = process.env.SYSTEM_ADMIN_EMAIL;

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
        user: process.env.TRANSPORT_AUTH_USER,
        pass: process.env.TRANSPORT_AUTH_PASS
    }
})

const generateVerificationCode = () => {

    let numeros = [];

    for (let i = 0; i < 6; i++) {
        let numeroAleatorio = Math.floor(Math.random() * 10); // Generates number from 0 to 9
        numeros.push(numeroAleatorio);
    }
    
    let numerosNumber = numeros.join(''); // Joins the array elements into a single string
    numerosNumber = Number(numerosNumber); // Converts the string to a number
    return numerosNumber;

}

const sendAdminVerificationCode = (req) => {

    const appVerificationCode = generateVerificationCode();

    transport.sendMail({
        from: `Quadros e Pinturas <${systemAdminEmail}`,
        to: `${systemAdminEmail}`,
        subject: 'Verificação de registro de usuário - Site Quadros e Pinturas',
        html: `<p>Um novo usuário está tentando se registrar como 
            administrador, para autenticar o registro insira o código de segurança:
            <strong>${appVerificationCode}</strong>
            </p>`
    })
    .then(() => {console.log('Email enviado com sucesso!');})
    .catch((error) => {console.log(`Erro ao enviar email: ${error}`);})

    return appVerificationCode;
    
}

module.exports = sendAdminVerificationCode;