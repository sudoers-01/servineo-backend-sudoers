import express from 'express';
import bodyParser from 'body-parser';
import _connect from './database';
import * as dotenv from 'dotenv';

dotenv.config();
_connect();

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({message: "Connection Available."});
});

app.listen(process.env.PORT, () => console.log(`App listening on: ${process.env.PORT}`));