const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.listen(3000, function() {
    console.log('listening on 3000')
  });

  /*
  // connection string is not working, also is it secure to keep connection string here?

const connectionString = "mongodb+srv://<reinforcements>:<reinforcements>@cluster0.2szva.mongodb.net/ReinforcementsData?retryWrites=true&w=majority"
MongoClient.connect(connectionString, (err, client) => {
    // ... do something here
    if (err) 
        return console.error(err)
    console.log('Connected to Database')
  })
  */
//CRUD handlers
app.get('/', (req, res) => {
    // res.send('Hello World')
    res.sendFile(__dirname + '/index.html')
  })

app.post('/bizCreateAcc', (req, res) =>{
    console.log("creating acc...");
    console.log(req.body);
})