require('dotenv').config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : 'mongodb://root:example@localhost:27017/library?authSource=admin';
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    PORT,
    MONGODB_URI,
    JWT_SECRET,
};