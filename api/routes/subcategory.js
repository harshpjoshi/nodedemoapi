const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const base64ToImage = require('base64-to-image');
const uuidv4 = require('uuid/v4');

const SubCategory = require('../model/subcategory');

// create state post

router.post('/', (req, res, next) => {
    console.log(req.body);

    var base64Str = req.body.scat_image;
    var path = './uploads/';

    var filename = uuidv4();
    var optionalObj = { 'fileName': filename, 'type': 'jpg' };

    base64ToImage(base64Str, path, optionalObj);

    const subcategory = new SubCategory({
        _id: new mongoose.Types.ObjectId(),
        mcat: req.body.mcat,
        scat_name: req.body.scat_name,
        scat_image: "https://healthcare-2.herokuapp.com/uploads/" + filename + ".jpg"
    });

    subcategory.save().then(result => {
        console.log(result);
        res.status(201).json({
            messgae: "Subcategory is Created Sucessfully.",
        });
    }).catch(err => console.log(err));
});

// get all states

router.get('/', (req, res, next) => {

    SubCategory.find()
        .select('_id scat_name scat_image mcat')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                mcategories: docs.map(doc => {
                    return {
                        scat_name: doc.scat_name,
                        mcat: doc.mcat,
                        scat_image: doc.scat_image,
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

router.get('/:scatId', (req, res, next) => {
    const id = req.params.scatId;
    SubCategory.findById(id)
        .select('scat_name scat_image mcat _id')
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

router.delete('/:scatId', (req, res, next) => {
    const id = req.params.scatId;
    var mcatName;
    SubCategory.findById(id)
        .select('scat_name scat_image mcat _id')
        .exec()
        .then(doc => {
            console.log(doc);
            scatName = doc;
        });
    SubCategory.findById(id)
        .remove({ _id: id }).exec().then(result => {
            res.status(200).json({
                message: 'SubCategory is Deleted',
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

// update state

router.put('/:scatId', (req, res, next) => {
    const id = req.params.scatId;

    SubCategory.findById(id, function (err, contact) {
        if (err)
            res.send(err);
        
        contact.mcat =  req.body.mcat;

        var base64Str = req.body.scat_image;
        var path = './uploads/';

        var filename = uuidv4();
        var optionalObj = { 'fileName': filename, 'type': 'jpg' };

        base64ToImage(base64Str, path, optionalObj);

        contact.scat_image =  "https://healthcare-2.herokuapp.com/uploads/" + filename + ".jpg";

        // save the contact and check for errors
        contact.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'SubCategory Info updated',
            });
        });
    });
});

module.exports = router;