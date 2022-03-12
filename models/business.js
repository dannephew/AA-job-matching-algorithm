var mongoose = require('mongoose');
var BusinessSchema = new mongoose.Schema({
    CompanyName: {
        type: String,
        // required: true,
    },
    NumberOfEmp: {
        type: Number,
        // required: true,
    },
    BusinessEmail: {
        type: String
    },
    Password: {
        type: String
    }
    // CompanyLocation: {
    //     type: Mixed, //? is there a better one
    //     required: true,
    // },
    // ManagerFirstName: {
    //     type: String,
    //     required: true,
    //     min: 2,
    //     max: 50,
    // },
    // ManagerLastName: {
    //     type: String,
    //     required: true,
    //     min: 2,
    //     max: 50,
    // },
    // PhoneNumber: {
    //     type: Number,
    //     required: true,
    //     min:10,
    //     max: 10,

    // },
    // CompanyCulture: {
    //     type: String,
    //     required: true,
    //     enum: ['Happy', 'Sad', 'Stressful']
    // }

})
module.exports = mongoose.model('Business', BusinessSchema, 'BusinessCollection')

