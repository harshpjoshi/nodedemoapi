const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    state: {type: mongoose.Schema.Types.ObjectId, ref: 'State', require: true},
    city_name: { type: String, required: true }
});

module.exports = mongoose.model('City', citySchema);