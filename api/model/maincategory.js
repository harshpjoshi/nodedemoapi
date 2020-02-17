const mongoose = require('mongoose');

const mainCategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mcat_image: { type: String, required: true },
    mcat_name: { type: String, required: true }
});

module.exports = mongoose.model('MainCategory', mainCategorySchema);