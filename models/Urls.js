const { Schema, model } = require('mongoose')

const urlSchema = new Schema({
    url: {
        type: String,
        unique: true,
        require: true,
    },
    shorturl: {
        type: Number,
        unique: true,
        require: true
    }
})

module.exports = model('Url', urlSchema);
