import nodemailer from 'nodemailer';
import { appEnv } from '../env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: appEnv.EMAIL_ADDRESS,
    pass: appEnv.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: appEnv.EMAIL_ADDRESS,
    to,
    subject,
    html
  });
};
