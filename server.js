const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
require('colors');

const { connectToDB } = require('./config/db');

dotenv.config({ path: './config/config.env' });

const bootcamps = require('./routes/bootcamps');
const { errorHandler } = require('./middleware/error');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectToDB();
  app.listen(
    PORT,
    console.log(
      `App listening on port ${PORT} and node env=${process.env.NODE_ENV}!`
    )
  );
};

startServer();
