const express = require('express');
const path = require('path');
const client = require('./lib/client.js');

const app = express();
app.use(express.json());
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

app.post('/soql', async (request, response) => {
	try{
		const result = await client.query(request);
		response.status(200).json(result)
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.post('/list', async (request, response) => {
	try{
		const result = await client.listSobject(request);
		response.status(200).json(result)
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.post('/describe', async (request, response) => {
	try{
		const result = await client.describe(request);
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