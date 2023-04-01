const WhatsappAPI = require('whatsapp-business-api');
require('dotenv').config();

let whatsappOnline = process.env.WHATSAPP_ID && process.env.WHATSAPP_TOKEN;

let wp = null;
if(whatsappOnline)
    wp = new WhatsappAPI({
        accountPhoneNumberId: process.env.WHATSAPP_ID,
        accessToken: process.env.WHATSAPP_TOKEN
    });

async function sendMessage(to, template) {
    if(!whatsappOnline)
        return console.log('Whatsapp não definido!');
    try {
        await wp.sendTextMessage(to, { message: template.title + ': ' + template.content });
        console.log('Mensagem enviada! Para: ' + to);
    } catch(e) {
        console.log('Erro ao enviar mensagem! Para:' + to);
    }
}


const nodemailer = require('nodemailer');

let mailOnline = process.env.MAIL && process.env.MAIL_PASS;

let transporter = null;
let credentials = {};
if(mailOnline) {
    credentials = {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }

    transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: credentials
    });
}

const sendMail = (to, template) => {
    if(!mailOnline)
        return console.log('Email não definido!');

    const mailOptions = {
        from: credentials.MAIL,
        to,
        subject: template.title,
        text: template.content
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error)
            console.log('Erro ao enviar email: ' + to);
        } else {
            console.log('Email enviado: ' + to);
        }
    });
}

const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()

async function dailyRevision() {
    await prisma.bill.updateMany({
        where: {
            pay: {
                gt: 0
            },
            paused: false,
            sended: false
        },
        data: {
            pay: {
                increment: -1
            }
        }
    });

    const bills = await prisma.bill.findMany({
        where: {
            pay: {
                lt: 1
            },
            paused: false,
            sended: false
        }
    });

    const template = await prisma.template.findFirst({
      where: {
        name: 'default'
      }
    });

    bills.forEach(bill => {
      if(bill.mail)
        sendMail(bill.mail, template);
      if(bill.contact)
        sendMessage(bill.contact, template);
    });

    await prisma.bill.updateMany({
      where: {
        pay: {
          lt: 1
        },
        paused: false,
        sended: false
      },
      data: {
        sended: true
      }
    });
}

module.exports = {
    dailyRevision
}
