import * as userService from '../services/user.js';
import * as otpService from '../services/otp.js';
import { HttpError } from '../utils/error.js';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      throw new HttpError('All fields are required', 400);
    }

    if (role && !['ADMIN', 'USER'].includes(role)) {
      throw new HttpError('Invalid role specified', 400);
    }

    const user = await userService.createUser(
      name,
      email,
      phoneNumber,
      password,
      role
    );

    await otpService.sendOtp(user);

    res.status(201).json({
      message: 'User created successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
