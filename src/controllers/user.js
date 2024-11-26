import * as userService from '../services/user.js';
import * as otpService from '../services/otp.js';

export async function createUser(req, res) {
  const { name, email, phoneNumber, password } = req.body;

  const user = await userService.createUser(name, email, phoneNumber, password);

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
}
