const dbPath = require('express').Router()
const Kanji = require('../models/kanji')
const Word = require('../models/word')

dbPath.post('/kanji', async (req, res) => {
    await Kanji.updateOne({ kanji: req.body.kanji },
        {
            $set: {
                kanji: req.body.query,
                data: req.body
            }
        },
        {upsert: true}, (e, r) => { if(e) {console.log(e); res.send(r)}})
})

// dbPath.delete('/kanji/:kanji', async (req, res) => {
//     const result = await Kanji.deleteOne({kanji: req.params.kanji })
//     res.send(result)
// })

dbPath.get('/kanji/:kanji', async (req, res) => {
    const result = await Kanji.findOne({ kanji: req.params.kanji })
    res.send(result)
})

dbPath.post('/word', async (req, res) => {

    const wordObj = new Word({
        wordSlug: req.body.slug,
        data: req.body
    })

    const result = await wordObj.save((e, r) => { if(e) {console.log(e); res.send(r)}})

    res.send(result)
})

// dbPath.delete('/word/:wordSlug', async (req, res) => {
//     const result = await Word.deleteOne({wordSlug: req.params.wordSlug })
//     res.send(result)
// })

dbPath.get('/word/:wordSlug', async (req, res) => {
    const result = await Word.findOne({ wordSlug: req.params.wordSlug })
    res.send(result)
})

module.exports = dbPath