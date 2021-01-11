import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config/envConstants';

const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

// const authorizeUrl = oAuth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: [
//     'https://www.googleapis.com/auth/userinfo.profile',
//     'https://www.googleapis.com/auth/userinfo.email',
//   ],
// });

export default oAuth2Client;
