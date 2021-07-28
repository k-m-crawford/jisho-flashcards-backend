const userPath = require('express').Router()
const Kanji = require('../models/kanji')
const Word = require('../models/word')
const User = require('../models/user')

userPath.post('/addReview/:username', async (req, res) => {

    const setToAdd = req.body.kanji ?
        {
            kanjiBank: { kanji: req.body.kanji,
                        nextReview: req.body.nextReview,
                        level: 1 }
        } :
        {
            wordBank: {  wordSlug: req.body.wordSlug,
                         nextReview: req.body.nextReview,
                         level: 1 }
        }

    await User.updateOne({ username: req.params.username },
        {
            $set: {
                username: req.params.username
            },
            $addToSet: setToAdd
        }, {upsert: true}, (e,r)=>{
            if(e){ 
                console.log(e)
                res.status(404).end() 
            }
            
            console.log("OK ? ", r.ok)

            res.status(200).send(r)
        })


})

userPath.put('/removeReview/:username', async (req, res) => {
    
    const toRemove = req.body.kanji ? { kanjiBank: { kanji: req.body.kanji } } 
                                    : { wordBank: { wordSlug: req.body.wordSlug }}

    const result = await User.updateOne({ username: req.params.username },
        {
            $pull: toRemove
        }, (e,r)=>{if(e){ console.log(e); res.status(404).end() }})

    res.status(200).send(result)
})

userPath.put('/updateReview/:type/:username/', async (req, res) => {

    const now = new Date()
    var nextReview 

    switch(req.body.newLevel){
        case 1: 
            nextReview = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                now.getHours() + 4, now.getMinutes(), now.getSeconds(), 0)
            break
        case 2: 
            nextReview = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                now.getHours() + 8, now.getMinutes(), now.getSeconds(), 0)
            break
        case 3: 
            nextReview = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1,
                now.getHours(), now.getMinutes(), now.getSeconds(), 0)
            break
        case 4: 
            nextReview = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2,
                now.getHours(), now.getMinutes(), now.getSeconds(), 0)
            break
        case 5: 
            nextReview = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7,
                now.getHours(), now.getMinutes(), now.getSeconds(), 0)
            break
        case 6: 
            nextReview = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14,
                now.getHours(), now.getMinutes(), now.getSeconds(), 0)
            break
        case 7: 
            nextReview = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(),
                now.getHours(), now.getMinutes(), now.getSeconds(), 0)
            break
        case 8: 
            nextReview = new Date(now.getFullYear(), now.getMonth() + 4, now.getDate(),
                now.getHours(), now.getMinutes(), curDate.getSeconds(), 0)
            break
    }

    console.log(nextReview.toString())

    const updateLookup = req.params.type === 'kanji' ? { username: req.params.username, 'kanjiBank.kanji': req.body.ref }
                                                     : { username: req.params.username, 'wordBank.wordSlug': req.body.ref }
    const bank = req.params.type === 'kanji' ? { 'kanjiBank.$.nextReview': nextReview, 'kanjBank.$.level': req.body.newLevel } 
                                                 : { 'wordBank.$.nextReview': nextReview, 'wordBank.$.level': req.body.newLevel }

    console.log(bank)

    await User.updateOne( updateLookup, 
        {
            $set: bank
        },
        (e, r) => {
            if(e){
                console.log(e)
                res.status(404).end()
            }
            else{
                res.status(200).send(r)
            }
        })

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
                    res.status(200).send({ reviews: d.kanjiBank.concat(d.wordBank) })
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
                
                const rev = toSearch.find(r => (r.nextReview < (new Date())))

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