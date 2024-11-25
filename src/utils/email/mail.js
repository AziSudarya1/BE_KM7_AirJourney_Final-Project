import nodemailer from 'nodemailer';
import { loadEnv } from '../env.js';

loadEnv();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html
  });
};
