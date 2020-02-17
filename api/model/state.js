const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    state_name: { type: String, required: true }
});

module.exports = mongoose.model('State', stateSchema);