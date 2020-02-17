const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const State = require('../model/state');

// create state post

router.post('/',(req,res,next)=>{
    console.log(req.body);

    const state = new State({
        _id: new mongoose.Types.ObjectId(),
        state_name: req.body.state_name,
    });

    state.save().then(result => {
        console.log(result);
        res.status(201).json({
            messgae: "State is Created Sucessfully.",
            createdState: {
                state_name: result.state_name,
            }
        });
    }).catch(err => console.log(err));
});

// get all states

router.get('/', (req, res, next) => {

    State.find()
        .select('_id state_name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                states: docs.map(doc => {
                    return {
                        stae_name: doc.state_name,
                        _id: doc._id,
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// get particular state

router.get('/:stateId', (req, res, next) => {
    const id = req.params.stateId;
    State.findById(id)
        .select('state_name  _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    states: doc,
                });
            } else {
                res.status(404).json({ message: "No Valid entry found" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                error: err
            });
        });
});


// delete state

router.delete('/:stateId', (req, res, next) => {
    const id = req.params.stateId;
    var stateName;
    State.findById(id)
        .select('state_name  _id')
        .exec()
        .then(doc => {
            console.log(doc);
            stateName = doc;
        });
    State.remove({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'State is Deleted',
            state_name:stateName
        });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

// update state

router.put('/:stateId', (req, res, next) => {
    const id = req.params.stateId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    // State.update({ _id: id }, { $set: updateOps }).exec().then(result => {
    //     res.status(200).json({
    //         message: 'State is Updated'
    //     });
    // }).catch(err => {
    //     res.status(500).json({ error: err });
    // });

    State.findById(id, function (err, contact) {
        if (err)
            res.send(err);
        contact.state_name = req.body.state_name;
        
        // save the contact and check for errors
        contact.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Contact Info updated',
            });
        });
    });
});

module.exports = router;