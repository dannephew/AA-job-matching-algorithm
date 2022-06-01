// // Get the zip codes from the employees
// // Get the zip codes from the employers
// // If there is a match, then append to a 
// //    list of potential employees
// // 
// // Return potential employees (with their info)
// //
// // Perspective from one business
// // See what employees are in the area
// // Go with that

// const match_by_location = (employees, employerZipCode) => {
//     potentialEmployees = [];

//     for (let i = 0; i < employees.length; i++) {
//         if 
//     }

// };

// // Habibi In Mediterranean Grill
// // 825 Church St, Evanston, IL 60201

// /* Figure out how to get employee location */
// // struct?
// match_by_location([], 60201);

/////////////////////////////////////

const { json } = require("express/lib/response");
const { Code } = require("mongodb");
var mongoose = require("mongoose");
const moment = require("moment");
var ObjectId = require("mongodb").ObjectId;

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://reinforcements:reinforcements@cluster0.2szva.mongodb.net/reinforcements?retryWrites=true&w=majority";

const exampleEmployer = {
  _id: new ObjectId("6279ca40d11ab022a8b733d4"),
  Location: ["Habibi In Mediterranean Gril", "825 Church St, Evanston, IL 60201"],
  Availability:
    '{"start":"2022-05-05T14:00:00.000Z","end":"2022-05-05T20:00:00.000Z"}',
  BusinessId: new ObjectId("6279ca3fd11ab022a8b733d0"),
  BusinessName: "klkl",
  __v: 0,
  Commitment: null,
  JobDesc: "nd",
  JobTitle: "ndndn",
  Skills: "",
  Composation: "",
  CovidPrecautions: "",
  DesiredStart: "",
  JobSchedule: null,
};

//converts a business or candidate profile into a number 
function readBusinessLocationData(scheduler) {
  /* I have to return the zip code here */
  location = scheduler["Location"][1];
  zipCode = location.slice(location.length-5, location.length);

  return zipCode;
}

function readCandidateLocationData(scheduler) {
  location = Number(scheduler["Location"]);
  return location;
}

function getCandidates(businessProfile, candidatesList) {
  matchedCandindates = [];
  let businessLocation = readBusinessLocationData(businessProfile);

  candidatesList.forEach(function (candidate, index) {
    let candidateLocation = readCandidateLocationData(candidate);

    /* Check if the candidate's zip code is the SAME as the employer */
    // Ideally, I would want to check if the candidate is in the same county as the employer
    if (candidateLocation == businessLocation) {
        console.log("HELLO");
        matchedCandindates.push(candidate);
    }
  });

  return matchedCandindates;
}

function listCandidates() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) reject(err);
      var dbo = db.db("reinforcements");

      dbo
        .collection("CandidateCollection")
        .find({ Availability: { $exists: true, $nin: ["", null, []] } })
        .toArray(function (err, result) {
          if (err) reject(err);
          db.close();
          resolve(result);
        });
    });
  });
};


/* Prints out candidates */

// listCandidates().then((allCandidates) => {
//   let matchCandidates = getCandidates(exampleEmployer, allCandidates);
//   console.log(matchCandidates);
// });

//exports.listCandidates = listCandidates();
//exports.getCandidates = getCandidates();

module.exports = {
  listCandidates, getCandidates, readBusinessLocationData, readCandidateLocationData
};
