const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authors: {
        type: [String],
        required: true,
    },
    publicationDate: {
        type: Date,
        required: true,
    },
    publicationUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Policy', 'Report', 'Research', 'Article', 'News', 'Brief','Others'],
        default: 'Report',
    }
}, { timestamps: true });

const Publication = mongoose.model('Publication', publicationSchema);
module.exports = Publication;