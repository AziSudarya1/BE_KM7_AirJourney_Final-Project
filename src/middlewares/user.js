import * as userServices from '../services/user.js';
import { HttpError } from '../utils/error.js';

export async function checkUserEmailorPhoneNumberExist(req, res, next) {
  const { email, phoneNumber } = req.body;
  const currentUser = res.locals.user;

  const skipUniqueCheckEmail = currentUser?.email === email;

  if (email && !skipUniqueCheckEmail) {
    const userEmail = await userServices.getUserByEmail(email);

    if (userEmail) {
      throw new HttpError('User with the same email already exist!', 409);
    }
  }

  const skipUniqueCheckPhoneNumber = currentUser?.phoneNumber === phoneNumber;

  if (phoneNumber && !skipUniqueCheckPhoneNumber) {
    const userPhoneNumber =
      await userServices.getUserByPhoneNumber(phoneNumber);

    if (userPhoneNumber) {
      throw new HttpError('User with the same phone already exist!', 409);
    }
  }

  next();
}
