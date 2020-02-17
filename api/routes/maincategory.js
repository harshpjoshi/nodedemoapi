const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const base64ToImage = require('base64-to-image');
const uuidv4 = require('uuid/v4');

const MainCategory = require('../model/maincategory');

// create state post

router.post('/', (req, res, next) => {
    console.log(req.body);

    var base64Str = req.body.mcat_image;
    var path = './uploads/';

    var filename = uuidv4();
    var optionalObj = { 'fileName': filename, 'type': 'jpg' };

    base64ToImage(base64Str, path, optionalObj);

    const maincategory = new MainCategory({
        _id: new mongoose.Types.ObjectId(),
        mcat_name: req.body.mcat_name,
        mcat_image: "https://healthcare-2.herokuapp.com/uploads/" + filename + ".jpg"
    });

    maincategory.save().then(result => {
        console.log(result);
        res.status(201).json({
            messgae: "Maincategory is Created Sucessfully.",
        });
    }).catch(err => console.log(err));
});

// get all states

router.get('/', (req, res, next) => {

    MainCategory.find()
        .select('_id mcat_image mcat_name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                mcategories: docs.map(doc => {
                    return {
                        mcat_image: doc.mcat_image,
                        mcat_name: doc.mcat_name,
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

router.get('/:mcatId', (req, res, next) => {
    const id = req.params.mcatId;
    MainCategory.findById(id)
        .select('mcat_name mcat_image  _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    mcat: doc,
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

router.delete('/:mcatId', (req, res, next) => {
    const id = req.params.mcatId;
    var mcatName;
    MainCategory.findById(id)
        .select('mcat_name mcat_image _id')
        .exec()
        .then(doc => {
            console.log(doc);
            mcatName = doc;
        });
    MainCategory.findById(id)
        .remove({ _id: id }).exec().then(result => {
            res.status(200).json({
                message: 'MainCategory is Deleted',
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

// update state

router.put('/:mcatId', (req, res, next) => {
    const id = req.params.mcatId;

    MainCategory.findById(id, function (err, contact) {
        if (err)
            res.send(err);
        contact.mcat_name = req.body.mcat_name;

        var base64Str = req.body.mcat_image;
        var path = './uploads/';

        var filename = uuidv4();
        var optionalObj = { 'fileName': filename, 'type': 'jpg' };

        base64ToImage(base64Str, path, optionalObj);

        contact.mcat_image =  "https://healthcare-2.herokuapp.com/uploads/" + filename + ".jpg";

        // save the contact and check for errors
        contact.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'MainCategory Info updated',
            });
        });
    });
});

module.exports = router;