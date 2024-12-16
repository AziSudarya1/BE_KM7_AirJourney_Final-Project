import nodemailer from 'nodemailer';
import fs from 'fs';
import Handlebars from 'handlebars';
import { appEnv } from '../env.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function compileTemplate(fileName, data) {
  const templateFile = fs.readFileSync(
    `${__dirname}/build/${fileName}.html`,
    'utf8'
  );
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

export async function sendEmail(to, subject, fileName, payload) {
  const html = compileTemplate(fileName, {
    name: to,
    ...payload
  });

  await transporter.sendMail({
    from: appEnv.EMAIL_ADDRESS,
    to,
    subject,
    html
  });
}
