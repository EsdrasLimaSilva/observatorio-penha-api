import { MongoClient, ServerApiVersion } from 'mongodb';
import config from './config.js';

export const client = new MongoClient(config.mongoURI || '', {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
