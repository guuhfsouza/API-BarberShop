const nodemailer = require('nodemailer');

const config_smtp = require('../configs/smtp');

const transporter = nodemailer.createTransport({
    service: config_smtp.service,
    host: config_smtp.host,
    port: config_smtp.port, 
    auth: {
        user: config_smtp.user,
        pass: config_smtp.pass,
     }
});

exports.sendEmail = async (customerShippingData) => {
            const response = await transporter.sendMail({
            from: `Barber Shop <gustavof_souza@outlook.com>`,
            to: customerShippingData.email,
            subject: 'Barber Shop - Senha padrão',
            text: 
                `Olá,
                Sua senha padrão é a senha: ${customerShippingData.passRender}.
                Faça a alteração através da opção Recuperar Senha`,
        });

        if(!response.messageId)
            return response.status(400).send({error: 'falha no envio do email'})
        else
            return response.messageId;
}