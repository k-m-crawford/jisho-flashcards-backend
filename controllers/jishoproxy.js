const jishoProxy = require('express').Router()
const Kanji = require('../models/kanji')
const Word = require('../models/word')

const JishoAPI = require('unofficial-jisho-api').prototype

jishoProxy.get('/phrase/:query', async (req, res) => {
    const hits = await JishoAPI.searchForPhrase(req.params.query)
    res.send(hits.data)
})

jishoProxy.get('/kanji/:query', async (req, res) =>{
    const hits = await JishoAPI.searchForKanji(req.params.query)
    res.send(hits)
})

module.exports = jishoProxy