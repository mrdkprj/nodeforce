const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const controller = require('./controller.js');

const fs = require('fs');

const app = express()
app.use(bodyParser.json())
//app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/main', (req, res) => {
	res.render("index.html", {});
})

// POST method route
app.post('/login', async (req, res) => {

	return await controller.authenticate(req)
		.then(r => res.status(200).json(r))
		.catch(e => res.status(400).json(e.message))
})

app.delete('/logout', (req, res) => {
	console.log("logout")
	res.json({username:"",token:""});
})

app.post("/test", (req, res) => {
	res.status(200).json(controller.test());
})

app.post('/soql', async (req, res) => {
	return await controller.query(req)
		.then(r => res.status(200).json(r))
		.catch(e => res.status(400).json(e.message))
})

app.post('/apex', async (req, res) => {
	return await controller.execute(req)
		.then(r => res.status(200).json(r))
		.catch(e => res.status(400).json(e.message))
})

console.log("port 8082")
app.listen(process.env.PORT || 8082)