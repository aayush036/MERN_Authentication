import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
})

export default transporter;