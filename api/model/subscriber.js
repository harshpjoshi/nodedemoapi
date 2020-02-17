const mongoose = require('mongoose');

const subscriberSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required:true},
    email: { type: String, required: true, unique: true, match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    mobile: {type: Number, required:true},
    password: { type: String, required: true },
    sp_image: { type: String, required: true },
    state: {type: mongoose.Schema.Types.ObjectId, ref: 'State', require: true},
    city:  {type: mongoose.Schema.Types.ObjectId, ref: 'City', require: true},
    address: { type: String, required: true }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);