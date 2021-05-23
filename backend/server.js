const express = require('express');
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient();
const path = require('path');
const client = require('./lib/client.js');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({credentials: true, origin: true}));

app.use(
	session({
	  store: new RedisStore({ client: redisClient }),
	  cookie: { maxAge: 60000 },
	  secret: "stfsdf",
	  name: "sessionId",
	  secure: true,
	  httpOnly: true,
	  sameSite: true,
	  //domain: 'localhost',
	  //path: 'foo/bar',
	  resave: false,
	  saveUninitialized: true,
	})
)

app.get('/main', (request, response) => {
	response.render("index.html", {});
})

// POST method route
app.post('/login', async (request, response) => {
	try{

		const result = await client.login(request);

		const msec = result.sessionSeconds * 100;
		request.session.cookie.expires = new Date(Date.now() + msec)
		request.session.cookie.maxAge = msec;
		request.session.token = result.token;
		request.session.serverUrl = result.serverUrl;

		response.status(200).json(result);

	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.delete('/logout', async (request, response) => {
	try{
		const result = await client.logout(request);
		response.status(200).json(result)
	}catch(ex){
		response.status(400).json(ex.message);
	}finally{
		request.session.destroy();
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