const dbPath = require('express').Router()
const Kanji = require('../models/kanji')
const Word = require('../models/word')

dbPath.post('/kanji', async (req, res) => {
    const result = await Kanji.updateOne({ kanji: req.body.kanji },
        {
            $set: {
                kanji: req.body.kanji
            }
        },
        {upsert: true}, (e, r) => { if(e) {console.log(e)}})

    res.send(result)
})

dbPath.delete('/kanji/:kanji', async (req, res) => {
    const result = await Kanji.deleteOne({kanji: req.params.kanji })
    res.send(result)
})

dbPath.get('/kanji/:kanji', async (req, res) => {
    const result = await Kanji.find({ kanji: req.params.kanji })
    res.send(result)
})

dbPath.post('/word', async (req, res) => {

    const result = await Word.updateOne({ wordSlug: req.body.wordSlug },
        {
            $set: {
                wordSlug: req.body.wordSlug
            }
        },
        {upsert: true}, (e, r) => { if(e) {console.log(e)}})

    res.send(result)
})

dbPath.delete('/word/:wordSlug', async (req, res) => {
    const result = await Word.deleteOne({wordSlug: req.params.wordSlug })
    res.send(result)
})

dbPath.get('/word/:wordSlug', async (req, res) => {
    const result = await Word.find({ wordSlug: req.params.wordSlug })
    res.send(result)
})

module.exports = dbPath