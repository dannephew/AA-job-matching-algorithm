var mongoose = require('mongoose');
var RosterSchema = new mongoose.Schema({
    BusinessName: {
        type: String,
        // required: true,
    },
    JobTitle: {
        type: String
    },
    hours: {
        type: String
    }

})
module.exports = mongoose.model('Roster', RosterSchema, 'RosterCollection') // Correct names?

