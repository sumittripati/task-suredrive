const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify your email - SureDrive',
        text: `Your verification code is: ${otp}. It expires in ${process.env.OTP_EXPIRE}.`,
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in ${process.env.OTP_EXPIRE}.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendOTP };
