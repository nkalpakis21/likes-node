const http = require('http');
const express = require('express');
const queue = require('queue');
let q = queue({ results: []});

const hostname = '127.0.0.1';

// Creating app 
const app1 = express();
const app2 = express();

const cors = require("cors");
app1.use(cors({ origin : '*'}));
app2.use(cors({ origin : '*'}));
app1.use(express.json())
app2.use(express.json())

const updateLikes = num => (req,res)=>{
    q.push(function (cb) {
        const result = {userId: 'some-user-id', targetPostId: 'some-target-id'}
        cb(null, result)
    });
    res.status(200).send({ success: 'true' })
    return;
}

const getLikes = num => async (req,res)=>{
    // TODO only write to stream if data has changed or if its first connection
    res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    });
    setInterval(() => {
        try{
            let likes = 0;

            // TODO have a batch job to update a DB with queued likes
            q.start(function (err) {
                if (err) throw err
                likes = q.results.flat().length;
            })
            res.write(`data: {"likes": ${likes}}`);
            res.write("\n\n");
            return;
        } catch (e) {
            console.log(e);
        }
    }, 1000);
}

app1.get('/likes', getLikes(1)).post('/likes', getLikes(1));
app2.get('/likes', getLikes(2)).post('/likes', getLikes(2));
app1.get('/likes/update', updateLikes(1)).post('/likes/update', updateLikes(1));
app2.get('/likes/update', updateLikes(2)).post('/likes/update', updateLikes(2));

app1.listen(3003,hostname,function(req,res){
    console.log(`server 1 - listening to server 3003`)
})

app2.listen(3004,hostname,function(req,res){
  console.log(`server 2 - listening to server 3004`)
})