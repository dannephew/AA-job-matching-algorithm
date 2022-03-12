var Business = require('./models/business');
const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
const { restart } = require('nodemon');
const business = require('./models/business');
var ObjectId = require('mongodb').ObjectId
const app = express();

var mongoDB = "mongodb+srv://reinforcements:reinforcements@cluster0.2szva.mongodb.net/reinforcements?retryWrites=true&w=majority";
//connecting to our database using the string above ^
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on("connected", function() {
  // if database connected properly you should see this in your command line v
  console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`)
})
//if there is an error in the database you see this instead
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('view engine', 'ejs')
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, function() {
    console.log('listening on 3000')
  });

app.post('/bizCreateAcc', (req, res) =>{
    //when a new business creates an account (aka sends a post request to /bizCreateAcc)
    //we save that business in a business object/scheme
    //req.body is how we get the user's input from the form they submitted
    var newBusiness = new Business();
    newBusiness.CompanyName = req.body.CompanyName;
    newBusiness.NumberOfEmp = req.body.NumberOfEmp;
    newBusiness.BusinessEmail = req.body.BusinessEmail;
    newBusiness.Password = req.body.Password;

    // then save that business object to our Bussiness collection database
    newBusiness.save().then(savedBusiness => {
      // once its saved it returns the business we just added to the db as savedBusiness
      console.log('saved new business', savedBusiness)
      console.log('its id', savedBusiness.id)

      // get the id for the business we added to the db and send the id to /businessInfo to display it to users
      var string = encodeURIComponent(savedBusiness.id)
      res.redirect('/businessInfo/'+string)
    }
    ).catch(err =>
        console.log('something went wrong when saving new business:', err)
      )

  })
//given a business id, shows account info
  app.get('/businessInfo/:id', (req, res) => {
    //we can acesses the id passed to /businessInfo through req.params.id
    var givenObjectId = (req.params.id).toString() // turning it from int->string
    console.log('given id: ', givenObjectId)
    
    //once we got the id passed to this function, search the database for that id
    db.collections.BusinessCollection.findOne({_id: ObjectId(givenObjectId)}).then(result =>{
        console.log('result', result)
        // when id is found in database, send the business account we found to displayBusiness so it can display the business information
        res.render('./employer/displayBusiness.ejs', {business: result})
      })
  })

//function to send you to homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/master-index.html')
})
//function to send you to candidate signup 
app.get('/candidate_signup', (req, res) => {
  res.sendFile(__dirname + '/candidate-index.html')
})
//function to send you to business signup
app.get('/business_signup', (req, res) => {
  res.sendFile(__dirname + '/business-index.html')
})
//function to send you to hr signup
app.get('/hr_signup', (req, res) => {
  res.sendFile(__dirname + '/hr-index.html')
})
