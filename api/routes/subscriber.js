const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const base64ToImage = require('base64-to-image');
const uuidv4 = require('uuid/v4');


const Subscriber = require('../model/subscriber');

router.post('/signup',(req,res,next)=>{
    
    Subscriber.find({email:req.body.email})
        .exec()
        .then(user=>{
            if(user.length >= 1){
                return res.status(409).json({
                    message: 'Email Already Exist'
                });
            }else{
                bcrypt.hash(req.body.password,10,(err, hash)=>{
                    if (err) {
                        return res.status(500).json({
                            error:err
                        });
                    }else{

                        var base64Str = req.body.sp_image;
                        var path = './uploads/';
                    
                        var filename = uuidv4();
                        var optionalObj = { 'fileName': filename, 'type': 'jpg' };
                    
                        base64ToImage(base64Str, path, optionalObj);
                    
                        const subscriber = new Subscriber({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            mobile: req.body.mobile,
                            state: req.body.state,
                            city: req.body.city,
                            address: req.body.address,
                            sp_image: "http://192.168.0.102:3000/uploads/subscriber/"+filename+".jpg"
                        });
            
                        subscriber.save()
                            .then(result=>{
                                console.log(result);
                                res.status(201).json({
                                    message:'Subscriber is Created'
                                });
                            })
                            .catch(err=>{
                                console.log(err);
                                res.status(500).json({
                                    error:err
                                });
                            });
                    }
                });
            }
        })
        .catch();
});

router.post('/login',(req,res,next)=>{
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                } 
                if (result) {

                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },"secret",{
                        expiresIn: "1h"
                    });

                    return res.status(200).json({
                        message:'Auth Sucessfull',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

router.delete('/:userId',(req,res,next)=>{
    User.deleteOne({_id:req.params.userId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message:"User Deleted"
            });
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
});
module.exports = router;