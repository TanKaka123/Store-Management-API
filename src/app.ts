import express, { Request } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import instanceMongodb from './dbs/init.mongodb';
import { checkOverload } from './helpers/check.connect';

import * as dotenv from 'dotenv';
import router from './routers';

dotenv.config();

const MONGODB_CONNECTION_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

const app = express();
// MIDDLEWARE
// logger
app.use(morgan('dev'))
// setting header
app.use(helmet())
// reduce size of response
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(router);

// DATABASE
// checkOverload();

(async () => {
    try {
        await instanceMongodb.connect('mongodb', MONGODB_CONNECTION_URI);
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
})();

export { app };