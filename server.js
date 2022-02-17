const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, function() {
    console.log('listening on 3000')
  });


  // is it secure to keep connection string here?

const connectionString = "mongodb+srv://reinforcements:reinforcements@cluster0.2szva.mongodb.net/reinforcements?retryWrites=true&w=majority"
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('data')
    const businessCollection = db.collection('businessCollection')

    //routes (crud handlers) go here
    app.post('/bizCreateAcc', (req, res) =>{

      businessCollection.insertOne(req.body)
      .then( result => {
        console.log("result sent to db", result)
        res.redirect('/businessInfo')
      })
      .catch(error => console.error(error))
    })

  
    app.get('/', (req, res) => {
      // res.send('Hello World')

      // console.log(cursor)/
      res.sendFile(__dirname + '/index.html')
    })
    
    app.get('/businessInfo', (req, res) => {
      // res.send('Hello World')
      //cursor lets you get data from the db - has lots fo methods
      const cursor = db.collection('businessCollection').find().toArray()
      .then(results => {
        console.log(results)
        res.render('displayBusiness.ejs', {businesses: results})
      })
      .catch(error => console.error(error))
      // console.log(cursor)//cursor lets you get data from the db - has lots fo methods
    })
  })



