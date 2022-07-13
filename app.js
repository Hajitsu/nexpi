const path = require('path');
const express = require('express');
const { notFound, expressErrorHandler } = require('./modules/errorHandler');
const Routes = require('./routes/router');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/TaskManager', (error) => {
	if (!error) console.log('connected to db...');
});

const app = express();

app.use(express.static(__dirname));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/', Routes);

app.use(notFound);
app.use(expressErrorHandler);

app.listen(1414, () => {
	console.log('server run on 1414');
});
