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
  Location: [null, ""],
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

//reformats time string if needed
function clean_time(time) {
  if (time.charAt(0) == "{" && time.charAt(time.length - 1) != "}") {
    return time.concat("}");
  }

  if (time.charAt(0) != "{" && time.charAt(time.length - 1) == "}") {
    return "{".concat(time);
  }

  return time;
}

//converts a business or candidate profile into an array of start/end times
function readTimeData(scheduler) {
  availability = scheduler["Availability"];

  const array_of_times = availability.split("},{");
  const parsed_times = [];

  array_of_times.forEach(function (unparsed_time, index) {
    cleaned_time = clean_time(unparsed_time);
    json_time = JSON.parse(cleaned_time);

    const new_start = new Date(json_time.start);
    const new_end = new Date(json_time.end);

    json_time.start = new_start;
    json_time.end = new_end;

    parsed_times.push(json_time);
  });

  return parsed_times;
}

function getCandidates(businessProfile, candidatesList) {
  var matchedCandindates = [];
  let businessHours = readTimeData(businessProfile);

  candidatesList.forEach(function (candidate, index) {
    let candidateHours = readTimeData(candidate);
    let check = compareHours(businessHours, candidateHours);
    if (check) {    
      matchedCandindates.push(candidate);
    }
    
  });
  
  return matchedCandindates;
}

//checks to see if the candidate is available for all the business needs
function compareHours(businessHours, candidateHours) {
  let counter = 0;

  businessHours.forEach(function (businessSlot) {
    //check all the candidateHours for a day of week that matches
    candidateHours.forEach(function (candidateSlot) {
      if (
        moment(candidateSlot.start).isBetween(
          businessSlot.start,
          businessSlot.end,
          undefined,
          "[]"
        ) &&
        moment(candidateSlot.end).isBetween(
          businessSlot.start,
          businessSlot.end,
          undefined,
          "[]"
        )
      ) {
        counter++;
      }
    });
  });

  //if the counter is equal to the length of the businessHours array, then that means that
  //the candidate meets the needs of the buisness. Say the business needs someone on Monday and Tuesday from 12:00 to 6:00.
  //if the counter was 0, then the candidate was not able to satisfy either the Monday or Tuesday needs.
  //if the counter was 1, then the candidate was available during 12:00 to 6:00 on only one of the two days.
  //if the counter was 2 (equal to the length of the array), then the candidate was available during 12:00 to 6:00 on both days
  if (counter == businessHours.length) {
    return true;
  } else {
    return false;
  }
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


// listCandidates().then((allCandidates) => {
//   let matchCandidates = getCandidates(exampleEmployer, allCandidates);
//   console.log(matchCandidates);
// });

//exports.listCandidates = listCandidates();
//exports.getCandidates = getCandidates();

module.exports = {
  listCandidates, getCandidates, compareHours, readTimeData, clean_time
};
