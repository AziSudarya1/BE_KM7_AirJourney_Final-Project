import * as userServices from '../services/user.js';
import { HttpError } from '../utils/error.js';

export async function checkUserEmailorPhoneNumberExist(req, res, next) {
  const { email, phoneNumber } = req.body;
  const currentUser = res.locals.user;

  const skipUniqueCheck =
    currentUser?.email === email && currentUser?.phoneNumber === phoneNumber;

  if (!skipUniqueCheck) {
    const user = await userServices.getUserByEmailOrPhoneNumber(
      email,
      phoneNumber
    );

    if (user) {
      throw new HttpError(
        'User with the same email or phone already exist!',
        409
      );
    }
  }

  next();
}
