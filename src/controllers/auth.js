import * as authService from '../services/auth.js';

export async function login(req, res) {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    message: 'Login successful',
    data: result
  });
}
