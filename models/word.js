const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    slug: {
        type: String,
        minLength: 1,
        required: true,
        unique: true
    }
})

wordSchema.set('toJSON', {
    transform: (doc, rObj) => {
        delete rObj._id
        delete rObj.__v
    }
})

module.exports = mongoose.model('Word', wordSchema)