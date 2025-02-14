import { auth, oauth2 as googleOauth2 } from '@googleapis/oauth2';
import { appEnv } from './env.js';

export const oauth2Client = new auth.OAuth2(
  appEnv.GOOGLE_CLIENT_ID,
  appEnv.GOOGLE_CLIENT_SECRET,
  appEnv.GOOGLE_REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

export const oauth2 = googleOauth2({
  auth: oauth2Client,
  version: 'v2'
});
