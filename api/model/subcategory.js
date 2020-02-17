const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mcat: {type: mongoose.Schema.Types.ObjectId, ref: 'MainCategory', require: true},
    scat_name: { type: String, required: true },
    scat_image: { type: String, required: true }
});

module.exports = mongoose.model('SubCategory', subCategorySchema);