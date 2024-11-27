const crypto = require('crypto');
import * as authService from '../services/auth.js';

export async function login(req, res) {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    message: 'Login successful',
    data: result
  });
}

export async function sendResetPasswordEmail(req, res) {
  try {
    const { email } = req.body;

    const token = crypto.randomBytes(32).toString('hex');

    await authService.storeResetPasswordToken(email, token);

    const result = await authService.sendResetPasswordEmail(email, token);

    return res.status(200).json({
      message: 'Email has been sent',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while sending the email',
      error: error.message
    });
  }
}
