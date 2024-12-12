import { authorizationUrl } from '../utils/oauth.js';
import * as oauthService from '../services/oauth.js';

export function getGoogleAuthorizationUrl(_req, res) {
  res.redirect(authorizationUrl);
}

export async function authenticateWithGoogle(req, res) {
  const { code } = req.query;
  const userData = await oauthService.getGoogleUserInfo(code);

  const data = await oauthService.checkOauthLoginOrRegisterUser(userData);

  res.status(200).json({
    message: 'Successfully authenticated',
    data
  });
}
