const express = require('express');
const path = require('path');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB= require('./config/dbConfig');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const port=4000;

connectDB();
app.use(logger('dev'));
app.use('/uploads',express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

module.exports = app;
