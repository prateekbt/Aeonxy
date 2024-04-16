import crypto from 'crypto';

// Generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
}