const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3, 
        required: true,
        unique: true
    },
    wordBank: {
        type: [],
        required: false
    },
    kanjiBank: {
        type: [],
        required: false
    }
})

userSchema.set('toJSON', {
    transform: (doc, rObj) => {
        delete rObj._id
        delete rObj.__v
    }
})

module.exports = mongoose.model('User', userSchema)