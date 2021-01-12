import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config/envConstants';

const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default oAuth2Client;
