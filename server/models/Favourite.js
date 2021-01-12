const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = FavouriteSchema = new Schema({
    tickerId: {
        type: Schema.Types.ObjectId,
        ref: 'ticker'
    },
    ticker: {
        type: String,
    },
    investmentAmount: {
        type: Number,
        default: 0
    },
    investmentDate: {
        type: Date,
        default: null,
    },
    investmentRate: {
        type: Number,
        default: null
    }
}, { timestamps: { createdAt: true, updatedAt: true }});