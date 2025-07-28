import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccountKey: admin.ServiceAccount;

if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_CREDENTIALS_JSON) {
  // In production, use the environment variable.
  serviceAccountKey = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
} else {
  // In development, use the local service account file.
  try {
    serviceAccountKey = require('./serviceAccountKey.json');
  } catch (error) {
    console.error('Error: serviceAccountKey.json not found.');
    console.error('Please ensure you have the service account key file in the /firebase directory for local development.');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export default admin;