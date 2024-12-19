import { oauth2, oauth2Client } from '../utils/oauth.js';
import * as userRepository from '../repositories/user.js';
import { generateToken } from '../utils/jwt.js';
import { HttpError } from '../utils/error.js';

export async function getGoogleUserInfo(code) {
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const { data } = await oauth2.userinfo.get();

  return data;
}

export async function createVerifiedUserWithNotifications(payload) {
  const user = await userRepository.createNotificationAndVerifiedUser(payload);

  return user;
}

export async function updateVerifiedUserWithNotification(userId) {
  const user =
    await userRepository.updateVerifiedUserAndCreateNotification(userId);

  return user;
}

export async function checkOauthLoginOrRegisterUser(data) {
  const { email, name, picture } = data;

  const isRequiredFieldsEmpty = !email || !name;

  if (isRequiredFieldsEmpty) {
    throw new HttpError('Email or name is empty', 400);
  }

  let user = await userRepository.getUserByEmail(email);

  const payload = {
    name: name,
    email: email,
    image: picture
  };

  const isUserExistsNotVerified = user && !user.verified;

  if (!user) {
    user = await createVerifiedUserWithNotifications(payload);
  }

  if (isUserExistsNotVerified) {
    user = await updateVerifiedUserWithNotification(user.id, payload);
  }

  const token = generateToken({ id: user.id, email: user.email });

  return {
    ...user,
    token
  };
}
