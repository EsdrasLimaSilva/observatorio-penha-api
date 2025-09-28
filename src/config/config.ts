import dotenv from 'dotenv';

dotenv.config();

const config = {
    mongoURI: process.env.ATLAS_URI,
    port: process.env.SERVER_PORT,
};

export default config;
