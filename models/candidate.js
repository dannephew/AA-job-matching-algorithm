var mongoose = require('mongoose');
var CandidateSchema = new mongoose.Schema({
    CandidateName: {
        type: String,
        // required: true,
    },
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    Phone: {
        type: String
    },
    Stage: {
        type: String
    }

})
module.exports = mongoose.model('Candidate', CandidateSchema, 'CandidateCollection') // Correct names?

