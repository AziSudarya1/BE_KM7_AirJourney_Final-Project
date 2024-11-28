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
  const { email } = req.body;

  await authService.sendResetPasswordEmail(email);

  res.status(200).json({
    message: 'Reset password email send successfully'
  });
}

export async function validateResetPasswordToken(req, res) {
  const { token } = req.params;

  await authService.validateResetPasswordToken(token);

  res.status(200).json({
    message: 'Reset password token is valid'
  });
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  await authService.resetPassword(token, newPassword);

  res.status(200).json({
    message: 'Password reset successfully'
  });
}
