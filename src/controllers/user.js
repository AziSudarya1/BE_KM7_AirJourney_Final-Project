import * as userService from '../services/user.js';
import * as otpService from '../services/otp.js';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (role && !['ADMIN', 'USER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
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
