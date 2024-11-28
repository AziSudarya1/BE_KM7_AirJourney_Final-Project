import ejs from 'ejs';
import nodemailer from 'nodemailer';
import path from 'path';
import { appEnv } from '../env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: appEnv.EMAIL_ADDRESS,
    pass: appEnv.EMAIL_PASSWORD
  }
});

export async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: appEnv.EMAIL_ADDRESS,
    to,
    subject,
    html
  });
}

export async function resetPasswordEmail(to, subject, variables) {
  const templatePath = path.join(process.cwd(), 'template/reset-password.ejs');

  const htmlContent = await ejs.renderFile(templatePath, variables);

  const info = await transporter.sendMail({
    from: appEnv.EMAIL_ADDRESS,
    to,
    subject,
    html: htmlContent
  });
}
