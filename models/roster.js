const { ObjectId } = require('mongodb');
var mongoose = require('mongoose');
var RosterSchema = new mongoose.Schema({
    BusinessName: {
        type: String
        // required: true,
    },
    BusinessId: {
        type: ObjectId
    },
    JobTitle: {
        type: String
    },
    JobDesc:{
        type: String
    },
    Skills:{
        type: String
    },
    Location:{
        type: Array
    },
    Commitment:{
        type: String
    },
    JobSchedule:{
        type: String
    },
    DesiredStart:{
        type: String
    },
    Hours: {
        type: String
    },
    Compensation:{
        type:String //should be num
    },
    CovidPrecautions:{
        type: String
    },
    Availability:{
        type:Array
    }

})
module.exports = mongoose.model('Roster', RosterSchema, 'RosterCollection') // Correct names?

