import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to , subject, html) => {
  const client = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });

  return client;
}
