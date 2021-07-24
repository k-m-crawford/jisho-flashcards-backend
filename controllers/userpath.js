const userPath = require('express').Router()
const Kanji = require('../models/kanji')
const Word = require('../models/word')
const User = require('../models/user')

userPath.post('/addReview/:username', async (req, res) => {

    const curDate = new Date()
    const nextReview = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(),
                                curDate.getHours() + 4, curDate.getMinutes(), curDate.getSeconds())
    
    const setToAdd = req.body.kanji ?
        {
            kanjiBank: { kanji: req.body.kanji,
                        nextReview: nextReview,
                        level: 1 }
        } :
        {
            wordBank: {  wordSlug: req.body.wordSlug,
                         nextReview: nextReview,
                         level: 1 }
        }

    const result = await User.updateOne({ username: req.params.username },
        {
            $set: {
                username: req.params.username
            },
            $addToSet: setToAdd
        }, {upsert: true}, (e,r)=>{if(e){ console.log(e); res.status(400).end() }})

    console.log("OK ? ", result.ok)

    res.status(200).send(result)

})

userPath.put('/removeReview/:username', async (req, res) => {
    
    const toRemove = req.body.kanji ? { kanjiBank: { kanji: req.body.kanji } } 
                                    : { wordBank: { wordSlug: req.body.wordSlug }}

    const result = await User.updateOne({ username: req.params.username },
        {
            $pull: toRemove
        }, (e,r)=>{if(e){ console.log(e); res.status(400).end() }})

    res.status(200).send(result)
})

userPath.get('/checkReview/:type/:username/:ref', async (req, res) => {

    const toFind = req.params.type === 'kanji' ? { username: req.params.username, "kanjiBank.kanji": req.params.ref }
                                               : { username: req.params.username, "wordBank.wordSlug": req.params.ref }

    await User.findOne(toFind, 
        (e, d) => {
            if(e)
                console.log(e)
            else if(d)
                res.status(200).end()
            else
                res.status(204).end()
        })

})

userPath.get('/getReviews/all/:type/:username', async (req, res) => {
    await User.findOne({ username: req.params.username }, 
        (e, d) => {
            if(e){
                console.log(e)
                res.status(404).end()
            }
            else if(d){
                if(req.params.type === 'kanji') 
                    res.status(200).send(d.kanjiBank)
                else if(req.params.type === 'word')
                    res.status(200).send(d.wordBank)
                else if(req.params.type === 'all')
                    res.status(200).send({ kanji: d.kanjiBank, words: d.wordBank })
                else
                    res.status(204).end()
            }
            else
                res.status(204).end()
        })
})

userPath.get('/getReviews/due/one/:type/:username', async (req, res) => {

    await User.findOne({ username: req.params.username }, 
        (e, d) => {
            if(e){
                console.log(e)
                res.status(404).end()
            }
            else if(d){
                
                let toSearch = null

                if(req.params.type === 'kanji')
                    toSearch = d.kanjiBank
                else if(req.params.type === 'word')
                    toSearch = d.wordBank
                else if(req.params.type === 'all')
                    toSearch = d.kanjiBank.concat(d.wordBank)
                
                const rev = toSearch.find(r => (new Date(r.nextReview)) < (new Date()))

                if(rev)
                    res.status(200).send(rev)
                else
                    res.status(204).end()

            }
            else{
                res.status(204).end()
            }
        })

})

module.exports = userPath