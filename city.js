const mongoose=require('mongoose')

const weatherSchema=new mongoose.Schema({

  city: String,
  weather: String,
  song: String,

  timestamp: {
    type: Date,
    default: Date.now
  }

});

const weatherSearch=mongoose.model('weatherSearch', weatherSchema);
module.exports=weatherSearch;