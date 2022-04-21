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
    Hours: {
        type: String
    }

})
module.exports = mongoose.model('Roster', RosterSchema, 'RosterCollection') // Correct names?

