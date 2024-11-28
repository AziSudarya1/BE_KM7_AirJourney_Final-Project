import * as passwordResetService from '../services/passwordReset.js';

export async function sendResetPasswordEmail(req, res) {
  const { email } = req.body;

  await passwordResetService.sendResetPasswordEmail(email);

  res.status(200).json({
    message: 'Reset password email send successfully'
  });
}

export async function validateResetPasswordToken(req, res) {
  const { token } = req.params;

  await passwordResetService.validateResetPasswordToken(token);

  res.status(200).json({
    message: 'Reset password token is valid'
  });
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  await passwordResetService.resetPassword(token, newPassword);

  res.status(200).json({
    message: 'Password reset successfully'
  });
}
