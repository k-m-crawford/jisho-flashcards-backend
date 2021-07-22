const mongoose = require('mongoose')

const kanjiSchema = new mongoose.Schema({
    kanji: {
        type: String,
        minLength: 1,
        required: true,
        unique: true
    }
})

kanjiSchema.set('toJSON', {
    transform: (doc, rObj) => {
        delete rObj._id
        delete rObj.__v
    }
})

module.exports = mongoose.model('Kanji', kanjiSchema)