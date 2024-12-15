import nodemailer from 'nodemailer';
import fs from 'fs';
import Handlebars from 'handlebars';
import { appEnv } from '../env.js';

function _compileTemplate(fileName, data) {
  const templateFile = fs.readFileSync(`./build/${fileName}.html`, 'utf8');
  const compiled = Handlebars.compile(templateFile);

  return compiled(data);
}

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
