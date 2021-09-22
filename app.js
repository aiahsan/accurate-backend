const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
 
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');

const api = process.env.API_URL;

 
app.use(`${api}/dashboard`, dashboardRoutes);
app.use(`${api}/users`, userRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'accurate_database',
  })
  .then(() => {
    console.log('Database Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(5000, () => {
  console.log('server is running http://localhost:5000');
});