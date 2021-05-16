const express = require('express');
const bodyParser = require('body-parser');
//const cors = require('cors');
const path = require('path');
const client = require('./lib/client.js');

const fs = require('fs');

const app = express()
app.use(bodyParser.json())
//app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/main', (request, response) => {
	response.render("index.html", {});
})

// POST method route
app.post('/login', async (request, response) => {
	try{
		const result = await client.login(request);
		response.status(200).json(result)
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.delete('/logout', async (request, response) => {
	try{
		const result = await client.logout(request);
		response.status(200).json(result)
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.post("/test", (request, response) => {
	response.status(200).json(client.test());
})

app.post('/soql', async (request, response) => {
	try{
		const result = await client.query(request);
		response.status(200).json(result)
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.post('/apex', async (request, response) => {
	try{
		const result = await client.execute(request);
		response.status(200).json(result)
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

console.log("port 8082")
app.listen(process.env.PORT || 8082)