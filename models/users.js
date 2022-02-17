import mongoose from "mongoose"

export {
    User
}

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
    }
})

const User = mongoose.model("User", userSchema)

