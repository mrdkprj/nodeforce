const express = require('express');
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const path = require('path');
const client = require('./lib/client.js');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const redisClient = redis.createClient();

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

const normalResposne = ({request, response, result}) => {
	response.append("limit", request.session.cookie.expires)
	response.status(200).json(result)
}

app.get('/main', (request, response) => {
	response.render("index.html", {});
})

// POST method route
app.post('/login', async (request, response) => {
	try{

		const result = await client.login(request);

		request.session.regenerate(function(err) {
			const msec = result.sessionSeconds * 100;
			request.session.cookie.expires = new Date(Date.now() + msec)
			request.session.cookie.maxAge = msec;
			request.session.token = result.token;
			request.session.serverUrl = result.serverUrl;
			request.session.username = result.username;

			response.append("username", result.username)
			return normalResposne({request, response});
		})

	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.delete('/logout', async (request, response) => {
	try{
		await client.logout(request);
	}catch(ex){

	}finally{
		response.status(200).json({status:"done"});
		request.session.destroy();
	}
})

app.all('*', async (request, response, next) => {

	if(request.session.token) return next();

	response.status(400).json("Session expired. Try login after logout.") ;
});

app.post('/soql', async (request, response) => {
	try{
		const result = await client.query(request);
		return normalResposne({request, response, result})
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.post('/list', async (request, response) => {
	try{
		const result = await client.listSobject(request);
		return normalResposne({request, response, result})
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.post('/describe', async (request, response) => {
	try{
		const result = await client.describe(request);
		return normalResposne({request, response, result})
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

app.post('/apex', async (request, response) => {
	try{
		const result = await client.execute(request);
		return normalResposne({request, response, result})
	}catch(ex){
		response.status(400).json(ex.message)
	}
})

console.log("port 8082")
app.listen(process.env.PORT || 8082)