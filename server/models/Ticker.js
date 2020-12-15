const mongoose = require("mongoose");

const TickerSchema = mongoose.Schema({
  ticker: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: true
  },
  assetType: {
    type: String,
    required: true
  },
  priceCurrency: {
    type: String,
    required: true
  },
  priceCurrency: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  favourite: {
    type: Boolean,
    default: false
  }
});

// export model user with UserSchema
module.exports = mongoose.model("ticker", TickerSchema);