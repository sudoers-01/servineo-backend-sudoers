const express = require('express');
const bodyParser = require('body-parser');
const _connect = require('./database');

require('dotenv').config();

_connect();

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({message: "Connection Available."});
});

app.listen(process.env.PORT, () => console.log(`App listening on: ${process.env.PORT}`));