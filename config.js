const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

const cors = require("cors");
app.use(cors({ origin : '*'}))

const servers = [
	"http://127.0.0.1:3003",
	"http://127.0.0.1:3004"
]

let current = 0;

const handler = async (req, res) =>{

	const { method, url, headers, body } = req;

	const server = servers[current];

    // TODO Round robin LB
    current === (servers.length-1)? current = 0 : current++

	try{

		const response = await axios({
			url: `${server}${url}`,
			method: method,
			headers: headers,
			data: body,
		});

		res.send(response.data)
	}
	catch(err){
        console.error(err);
		res.status(500).send(err)	
	}
}

app.get('/favicon.ico', (req, res
	) => res.sendFile('/favicon.ico'));

// When receive new request
// Pass it to handler method
app.use((req,res)=>{handler(req, res)});

// Listen on PORT 8080
app.listen(8080, err =>{
	err ?
	console.log("Failed to listen on PORT 8080"):
	console.log("Load Balancer Server "
		+ "listening on PORT 8080");
});
