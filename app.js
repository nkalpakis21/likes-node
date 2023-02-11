const http = require('http');
const express = require('express');
const fetch = require('node-fetch');

const hostname = '127.0.0.1';
const port = 3002;

const serverBaseURL = "http://127.0.0.1:8080";


// Creating app 
const app = express()
const cors = require("cors");
app.use(cors({ origin : '*'}))

app.get('/likes', async function(req,res){
  
    // TODO only write to stream if data has changed or if its first connection
    res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      });
      setInterval(async() => {
        try{
            await fetch(`${serverBaseURL}/likes`, {method: 'GET'})
            .then((res) => res.json())
            .then((data) => {
                try{
                    console.log('writing!');
                    res.write(`data: {"likes": ${data.likes}}`);
                    res.write("\n\n");
                    return;
                } catch(e) {
                    console.error(e);
                    return;
                }
            })
        } catch (e) {
            console.log('***********');
            console.log(e);
        }
        
      }, 0250);
});
  


app.listen(port,hostname,function(req,res){
    // Logging when the server has started
    console.log(`listening to server ${port}`)
})
