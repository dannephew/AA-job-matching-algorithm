// Require models
var Business = require("./models/business");
var Candidate = require("./models/candidate");
var Roster = require("./models/roster");

// job matches
var matchHelp = require("./schedule");
//console.log(matches);

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
//const { restart } = require('nodemon');
const business = require("./models/business");
var ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(express.static(__dirname + '/public'));
var mongoDB =
  "mongodb+srv://reinforcements:reinforcements@cluster0.2szva.mongodb.net/reinforcements?retryWrites=true&w=majority";
//connecting to our database using the string above ^
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("connected", function () {
  // if database connected properly you should see this in your command line v
  console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
});
//if there is an error in the database you see this instead
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
  console.log("listening on 3000");
});

app.post("/bizCreateAcc", (req, res) => {
  //when a new business creates an account (aka sends a post request to /bizCreateAcc)
  //we save that business in a business object/scheme
  //req.body is how we get the user's input from the form they submitted
  var newBusiness = new Business();
  newBusiness.CompanyName = req.body.CompanyName;
  newBusiness.NumberOfEmp = req.body.NumberOfEmp;
  newBusiness.BusinessEmail = req.body.BusinessEmail;
  newBusiness.Password = req.body.Password;

  // then save that business object to our Bussiness collection database
  newBusiness
    .save()
    .then((savedBusiness) => {
      // once its saved it returns the business we just added to the db as savedBusiness
      console.log("saved new business", savedBusiness);
      console.log("its id", savedBusiness.id);

      // get the id for the business we added to the db and send the id to /businessInfo to display it to users
      var string = encodeURIComponent(savedBusiness.id);
      res.redirect("/businessInfo/" + string);
    })
    .catch((err) =>
      console.log("something went wrong when saving new business:", err)
    );
});

app.post("/candCreateAcc", (req, res) => {
  var newCandidate = new Candidate();
  newCandidate.CandidateName = req.body.CandidateName;
  newCandidate.Email = req.body.Email;
  newCandidate.Password = req.body.Password;

  // Save Candidate object to Candidate collection database
  newCandidate
    .save()
    .then((savedCandidate) => {
      console.log("saved new candidate", savedCandidate);
      console.log("its id", savedCandidate.id);

      // get the id for the candidate we added to the db and send the id to /??? to display it to users
      var string = encodeURIComponent(savedCandidate.id);
      res.redirect("/candidateInfo/" + string);
    })
    .catch((err) =>
      console.log("something went wrong when saving new candidate:", err)
    );
});

// given a business id, shows account info
app.get("/businessInfo/:id", (req, res) => {
  //we can acesses the id passed to /businessInfo through req.params.id
  var givenObjectId = req.params.id.toString(); // turning it from int->string

  console.log("given id: ", givenObjectId);

  //once we got the id passed to this function, search the database for that id
  db.collections.BusinessCollection.findOne({
    _id: ObjectId(givenObjectId),
  }).then((result) => {
    console.log("result", result);
    db.collections.RosterCollection.find({BusinessId:ObjectId(givenObjectId) }).limit(4).toArray().then(rosters =>{
      console.log("rosters", rosters)
      // when id is found in database, send the business account we found to displayBusiness so it can display the business information
      res.render("./employer/displayBusiness.ejs", { business: result, matches: null, rosters: rosters});
  });
    })
    
    
});

//given a business id and roster id, shows account info and matching candidates
app.get("/businessInfo/:bus_id/:ros_id", (req, res) => {
  //we can acesses the id passed to /businessInfo through req.params.id
  var business_id = req.params.bus_id.toString(); // turning it from int->string
  console.log("given id: ", business_id);

  //once we got the id passed to this function, search the database for that id
  db.collections.BusinessCollection.findOne({
    _id: ObjectId(business_id),
  }).then((result) => {
    console.log("result", result);

    // getting candidates with matching availabilities
    matchCandidates = matchHelp.listCandidates().then((allCandidates) => {
      //console.log(allCandidates);
      let matchCandidates = matchHelp.getCandidates(result, allCandidates);
      //console.log("Matched candid", matchCandidates);
      return matchCandidates;
    });

    //console.log("Match candidates promise: ", matchCandidates);
    matchCandidates.then(function(matches) {
      console.log("Match candidates result", result);
      db.collections.RosterCollection.find({BusinessId:ObjectId(business_id) }).limit(4).toArray().then(rosters =>{
        res.render("./employer/displayBusiness.ejs", { business: result, matches: matches, rosters:rosters });
      })
      
    }).catch(function() {
      console.log("Match candidates promise rejected");
      db.collections.RosterCollection.find({BusinessId:ObjectId(business_id)}).limit(4).toArray().then(rosters =>{
        res.render("./employer/displayBusiness.ejs", { business: result, matches: matches, rosters:rosters });
      })
    });
  });
});

//given a candidate id, shows account info
app.get("/candidateInfo/:id", (req, res) => {
  var givenObjectId = req.params.id.toString(); // turning it from int->string
  console.log("given id: ", givenObjectId);
  db.collections.CandidateCollection.findOne({
    _id: ObjectId(givenObjectId),
  }).then((result) => {
    console.log("result", result);
    res.render("./employee/displayCandidate.ejs", { candidate: result });
  });
});




//given a business id, shows roster info
app.get("/rosterInfo/:id", (req, res) => {
  //we can access the id passed to /businessInfo through req.params.id
  var givenObjectId = req.params.id.toString(); // turning it from int->string

  console.log("given id: ", givenObjectId);

  //once we got the id passed to this function, search the database for that id
  db.collections.BusinessCollection.findOne({
    _id: ObjectId(givenObjectId),
  }).then((result) => {
    console.log("result", result);
    // when id is found in database, send the business account we found to displayBusiness so it can display the business information
    res.render("./employer/displayBusiness.ejs", { business: result });
  });
});

//function to send you to homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/master-index.html");
});
app.get("roster_calender", (req, res) => {
  res.render("./employer/rosterCalender.ejs");
});
//function to send you to candidate signup
app.get("/candidate_signup", (req, res) => {
  res.sendFile(__dirname + "/candidate-index.html");
});
//function to send you to business signup
app.get("/business_signup", (req, res) => {
  res.sendFile(__dirname + "/business-index.html");
});
//function to send you to hr signup
app.get("/hr_signup", (req, res) => {
  res.sendFile(__dirname + "/hr-index.html");
});
//triggered when add roster is clicked on homepage
app.get("/roster_creation/1/:id", (req, res) => {
  var givenObjectId = req.params.id.toString(); // turning it from int->string
  
  db.collections.BusinessCollection.findOne({
    _id: ObjectId(givenObjectId),
  }).then((result) => {
    
    console.log("biz found", result);
    // creates a new roster and stores the business id in the roster
    var newRoster = new Roster();
    newRoster.BusinessId = result._id;
    newRoster.BusinessName = result.CompanyName;
    newRoster
      .save()
      .then((savedRoster) => {
        console.log("1st page SAVEDROSTER: ", savedRoster);
        res.render("./employer/firstRosterPage", { roster: savedRoster });
      })
      .catch((err) =>
        console.log("something went wrong when saving new roster:", err)
      );
    
  });
});
// triggered when clicking "next" on first roster page
app.post("/roster_creation/2/:id", (req, res) => {
  var givenObjectId = req.params.id.toString(); // turning it from int->string
  console.log("given id: ", givenObjectId);
  console.log('given form', req.body)
  // find the current roster through the id passed in the url and update it 
  db.collections.RosterCollection.updateOne(
    {_id: ObjectId(givenObjectId)}, //finding the roster to modify
    // modifying the roster
    {
      $set: {
      JobTitle: req.body.JobTitle,
      JobDesc:req.body.JobDesc,
      Skills: req.body.Skills,
      Location: [req.body.location, req.body.locationInfo],
      Commitment: req.body.commitment
    }
  }).then((result) => {
    // finding the roster in db to pass to second page
    db.collections.RosterCollection.findOne({_id: ObjectId(givenObjectId)}).then(result =>{
        console.log('is roster updated', result)
        res.render('./employer/secondRosterPage', {roster: result})
      })
  })
});
// triggered when "next" is pressed on the second roster_creation page
app.post("/roster_creation/3/:id", (req, res) => {
  
  var givenObjectId = req.params.id.toString(); // turning it from int->string
  // finds and updates roster
  db.collections.RosterCollection.updateOne(
    {_id: ObjectId(givenObjectId)}, //finding the roster to modify
    // modifying the roster
    {
      $set: {
      JobSchedule: req.body.jobSchedule,
      DesiredStart:req.body.desiredStart,
      Composation: req.body.Compensation,
      CovidPrecautions: req.body.CovidPrecautions
      // do we need to add length of role?

    }
  }).then((result) => {
    db.collections.RosterCollection.findOne({_id: ObjectId(givenObjectId)}).then(result =>{
        console.log('is roster updated', result)
        res.render("./employer/rosterCalender", { roster: result });
      })
  })
});
// triggered after filling out hours on calender
app.post("/display_roster/:id", (req, res) => {
  //var newRoster = new Roster();
  var givenObjectId = req.params.id.toString(); // turning it from int->string
  console.log("submit final: ", givenObjectId);
  console.log("events to add", req.body);
  
  db.collections.RosterCollection.updateOne(
    {_id: ObjectId(givenObjectId)}, //finding the roster to modify
    // modifying the roster
    {
      $set: {
      Availability: req.body.calEvents
    }
  }).then((result) => {
    // for now just displaying info of roster on roster page
    db.collections.RosterCollection.findOne({_id: ObjectId(givenObjectId)}).then(result =>{

      // updates the business with a available times
        db.collections.BusinessCollection.updateOne(
          {_id: ObjectId(result.BusinessId)},
          {
            $set: {
              Availability: req.body.calEvents
            }
          }).then((result) => {
            console.log('updated business', result);
          });

        console.log('roster is submitted', result);

        res.render("./employer/displayRoster", { roster: result });
      })
  })
});

app.get("/display_roster/:id", (req, res) => {
  var givenObjectId = req.params.id.toString(); // turning it from int->string
  console.log("given id: ", givenObjectId);
  res.render("./employer/displayRoster");

  db.collections.RosterCollection.findOne({
    _id: ObjectId(givenObjectId),
  }).then((result) => {
    console.log("roster result", result);
    res.render("./employer/displayRoster", { roster: result });
  });
});