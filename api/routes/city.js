const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const City = require('../model/city');

// create city post

router.post('/',(req,res,next)=>{
    console.log(req.body);

    const city = new City({
        _id: new mongoose.Types.ObjectId(),
        state: req.body.state,
        city_name: req.body.city_name
    });

    city.save().then(result => {
        console.log(result);
        res.status(201).json({
            messgae: "City is Created Sucessfully.",
            createdCity: {
                city: result.city_name,
            }
        });
    }).catch(err => console.log(err));
});

// get all city

router.get('/', (req, res, next) => {

    City.find()
        .select('_id city_name state')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                states: docs.map(doc => {
                    return {
                        city_name: doc.city_name,
                        state: doc.state,
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

// get particular city

router.get('/:cityId', (req, res, next) => {
    const id = req.params.cityId;
    City.findById(id)
        .select('city_name state  _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    cities: doc,
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


// delete city

router.delete('/:cityId', (req, res, next) => {
    const id = req.params.cityId;
    var cityName;
    City.findById(id)
        .select('city_name state _id')
        .exec()
        .then(doc => {
            console.log(doc);
            cityName = doc;
        });
        City.remove({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'City is Deleted',
            city_name:cityName
        });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

// update city

router.put('/:cityId', (req, res, next) => {
    const id = req.params.cityId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    // City.update({ _id: id }, { $set: updateOps }).exec().then(result => {
    //     res.status(200).json({
    //         message: 'City is Updated'
    //     });
    // }).catch(err => {
    //     res.status(500).json({ error: err });
    // });
    City.findById(id, function (err, contact) {
        if (err)
            res.send(err);
        contact.city_name = req.body.city_name;
        contact.state = req.body.state;
        // save the contact and check for errors
        contact.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'City Info updated',
            });
        });
    });
});

module.exports = router;