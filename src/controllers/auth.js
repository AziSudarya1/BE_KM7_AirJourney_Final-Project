import * as authService from '../services/auth.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: {
        name: result.user.name,
        role: result.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
