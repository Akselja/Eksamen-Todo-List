const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/routes');
const dotenv = require('dotenv');
const cookies = require("cookie-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended : true }));
app.use(cookies());

dotenv.config();
const url = process.env.url;

mongoose.connect(url)
.then(() => app.listen(80, () => console.log('listening to port 80')))
.catch(err => console.log(err));

app.use(router);